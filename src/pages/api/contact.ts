import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const LIMITS = { name: 200, email: 320, message: 5000 };

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
	const wantsJson = request.headers.get('Accept')?.includes('application/json');
	const reply = (status: number, error?: string) =>
		wantsJson
			? Response.json(error ? { error } : { ok: true }, { status })
			: error
				? new Response(error, { status })
				: redirect('/?contact=sent#contact', 303);

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return reply(400, 'Invalid form submission.');
	}

	const field = (key: string) => String(form.get(key) ?? '').trim();
	const name = field('name');
	const email = field('email');
	const message = field('message');

	// Honeypot tripped: pretend it worked so bots don't retry.
	if (field('website')) return reply(200);

	if (!name || !email || !message) return reply(400, 'Please fill out every field.');
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, 'Please enter a valid email address.');
	if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message)
		return reply(400, 'That message is too long.');

	await env.DB.prepare(
		'INSERT INTO contact_messages (name, email, message, ip, user_agent) VALUES (?, ?, ?, ?, ?)',
	)
		.bind(name, email, message, clientAddress, request.headers.get('User-Agent'))
		.run();

	return reply(200);
};
