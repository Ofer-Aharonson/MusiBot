# Security Policy

## Sensitive Information

This repository does **NOT** contain any sensitive information:

- ✅ `token.json` is gitignored
- ✅ `.env` is gitignored
- ✅ No credentials in code
- ✅ No API keys committed

## Setup

To run this bot, you need to:

1. Create your own `.env` file based on `.env.example`
2. Add your Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)
3. Never commit your `.env` or `token.json` files

## Reporting Security Issues

If you discover a security vulnerability, please email the repository owner instead of using the issue tracker.

## Best Practices

When contributing to this project:

- ✅ Never commit credentials
- ✅ Use environment variables
- ✅ Check `.gitignore` before committing
- ✅ Run `git status` to verify what you're committing
- ✅ Use `.env.example` as a template (without real values)
