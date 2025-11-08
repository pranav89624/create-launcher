# Contributing to Create Launcher

🚀 Thank you for your interest in contributing to **Create Launcher**!

We welcome contributions of all kinds — from bug fixes and new features to templates and docs. Here's how to get started:

## 🔧 Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/create-launcher.git
   cd create-launcher
   ```
3. **Install dependencies**: `npm install`
4. **Build the project**: `npm run build`
5. **Link for local testing**: `npm link`

## 📁 Adding New Templates

To add a new project template:

1. Create a new folder in `templates/` with your template name
2. Add all necessary files for the template
3. Update `src/types.ts` to include your new template type
4. Update `src/prompts.ts` to include the template in the selection
5. Update `src/actions/index.ts` to handle the new template
6. Update the `README.md` of the template with template information

## 🧹 Code Guidelines

- Use **TypeScript**
- Follow existing project structure and naming conventions
- Add proper **error handling**
- Include helpful console messages

## ✅ Testing Your Changes

Before submitting a PR, test everything thoroughly:

```bash
npm run build     # Compile CLI
npm run dev       # Optional: run dev script if available
create-launcher   # Use your linked CLI to test different configurations
```

Try generating a few test projects using your new template or changes.

## 🔁 Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

## Questions?

Feel free to open an issue or start a discussion for any questions or suggestions!
