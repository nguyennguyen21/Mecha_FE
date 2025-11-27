# Environment Configuration

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` file and set your backend URL:
```env
VITE_BASE_URL=http://localhost:5159
```

## Default Values

- **Development**: `http://localhost:5159` (default backend port)
- **Production**: Update to your production backend URL

## Usage

The API base URL is automatically loaded from `VITE_BASE_URL` environment variable.

All API calls use either:
- `API_CONFIG.BASE_URL` (from `src/configs/ApiConfig.tsx`)
- `import.meta.env.VITE_BASE_URL` (direct access)

Both will fallback to `http://localhost:5159` if the env variable is not set.

## Important Notes

- Vite requires the `VITE_` prefix for environment variables
- Restart the dev server after changing `.env` file
- Never commit `.env` file to git (it's in `.gitignore`)

