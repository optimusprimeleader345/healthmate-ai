# Contributing to HealthMate AI

Thank you for your interest in contributing to HealthMate AI! We welcome contributions from developers, healthcare professionals, and the community.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/yourusername/healthmate-ai.git
   cd healthmate-ai
   ```
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** and test thoroughly
5. **Commit with conventional commits**: `git commit -m "feat: add new feature"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request** with detailed description

## 📋 Contribution Guidelines

### Code Standards
- **TypeScript**: Strict typing required for all new code (already configured)
- **ESLint**: Follow Airbnb configuration (automatically enforced)
- **Prettier**: Use automatic formatting (run `npm run format`)
- **Testing**: Write tests for new features (Jest + React Testing Library)

### Commit Convention
We use [Conventional Commits](https://conventionalcommits.org/):
```bash
feat: add new health tracking feature        # New feature
fix: resolve authentication bug              # Bug fix
docs: update API documentation               # Documentation
test: add unit tests for user validation     # Testing
refactor: improve component architecture     # Refactoring
chore: update dependencies                   # Maintenance
```

### Pull Request Process
1. **Check Title**: Clear, descriptive title following commit convention
2. **Add Description**: Include screenshots/videos for UI changes
3. **Reference Issues**: Link related GitHub issues (#123)
4. **Testing**: Describe how changes were tested
5. **Breaking Changes**: Highlight if any APIs changed
6. **Screenshots**: For UI changes, include before/after screenshots

## 🧪 Development Workflow

### Local Development Setup
```bash
# Install all dependencies
npm install
cd backend && npm install && cd ..

# Start development servers
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Access at http://localhost:5177
```

### Quality Checks
```bash
# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test
```

## 🎯 Areas for Contribution

### High Impact Contributions
- **AI/ML Enhancements**: Improve health predictions and insights
- **Accessibility**: Expand screen reader support and WCAG compliance
- **Performance**: Optimize bundle size and loading times
- **Mobile Experience**: Enhance PWA capabilities and responsive design

### Beginner-Friendly Contributions
- **Documentation**: Help improve docs and guides
- **UI Components**: Enhance existing component styling
- **Testing**: Write more comprehensive test cases
- **Bug Fixes**: Fix reported issues in the issue tracker
- **TypeScript**: Add strict typing to existing JavaScript files

### Healthcare Domain Expertise
- **Medical Integration**: Add new health metrics and tracking
- **Clinical Research**: Implement evidence-based health algorithms
- **Compliance**: Ensure HIPAA/GDPR standards in new features
- **Data Privacy**: Enhance data security and user privacy features

## 🧪 Testing Requirements

### Unit Tests (Jest + React Testing Library)
```javascript
// Component rendering and interactions
describe('HealthCard', () => {
  it('renders health data correctly', () => {
    render(<HealthCard data={mockData} />);
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
  });
});
```

### Integration Tests
- User workflows (registration → dashboard navigation)
- API endpoint functionality
- Data persistence scenarios
- Error handling and edge cases

### E2E Tests (Playwright - Future)
- Critical user journeys
- Multi-page workflows
- Mobile responsiveness validation

## 🏗️ Architecture Guidelines

### Frontend Architecture
- **React Components**: Functional components with hooks
- **State Management**: Zustand for global state (already configured)
- **API Calls**: Centralized in `src/services/`
- **Styling**: Tailwind CSS with component-based approach
- **Routing**: React Router with protected routes

### Backend Architecture
- **Express Routes**: RESTful API design
- **MongoDB Models**: Mongoose schemas for data validation
- **Middleware**: Authentication, validation, rate limiting
- **Error Handling**: Centralized error responses
- **Security**: JWT authentication with bcrypt password hashing

### Database Guidelines
- **Data Models**: Follow existing schema patterns
- **Validation**: Required field validation in schemas
- **Indexing**: Add indexes for frequently queried fields
- **Relationships**: Proper referencing between models

## 📖 Documentation Requirements

### Code Documentation
```typescript
/**
 * Calculates health risk score based on vital signs
 * @param {Vitals} vitals - Current vital signs data
 * @param {History} history - Historical health data
 * @returns {number} Risk score between 0-100
 */
export function calculateRiskScore(vitals: Vitals, history: History): number {
  // Implementation
}
```

### API Documentation
All endpoints must be documented with:
- HTTP method and route
- Request/response examples
- Authentication requirements
- Error response codes

### User Documentation
- Setup guides for new contributors
- Component usage examples
- Architecture decision records (ADRs)

## 🤝 Code Review Process

### Reviewer Checklist
- ✅ **Functionality**: Does it work as expected?
- ✅ **Code Quality**: Clean, readable, maintainable?
- ✅ **TypeScript**: Proper typing throughout?
- ✅ **Testing**: Adequate test coverage?
- ✅ **Documentation**: Code and API docs updated?
- ✅ **Security**: No security vulnerabilities?
- ✅ **Performance**: No performance regressions?

### Automated Checks
- **GitHub Actions**: CI/CD pipeline runs automatically
- **Code Quality**: ESLint + Prettier checks
- **Tests**: All tests must pass
- **Build**: Must build successfully

## 📄 License & Legal

### Contributor License Agreement
By contributing to HealthMate AI, you agree to license your contributions under the same MIT License as the project.

### Intellectual Property
- All contributions remain your IP until contributed
- Project maintainers may modify or remove contributions
- Commercial use allowed under MIT license terms

## 🎉 Recognition & Rewards

### Contributor Recognition
- **CONTRIBUTORS.md**: Listed in project's contributor list
- **Release Notes**: Mentioned in changelog
- **Social Media**: Tagged in project updates
- **Certificates**: Digital certificates for significant contributions

### Contribution Levels
- **🥉 Beginner**: Documentation, bug fixes, small features
- **🥈 Intermediate**: New components, API endpoints, testing
- **🥇 Advanced**: Architecture changes, major features, performance

---

## 📞 Getting Help

- **GitHub Discussions**: General questions and help
- **Issues**: Bug reports and feature requests
- **Discord**: Real-time chat for contributors (planned)
- **Documentation**: Comprehensive guides in `docs/` folder

## 🎯 Our Vision

**Together**, we're building the future of healthcare management. Every contribution, no matter how small, helps improve healthcare outcomes for users worldwide.

**Welcome to the HealthMate AI contributor community!** 🏥💙

---

*This contribution guide is part of HealthMate AI's commitment to open-source healthcare innovation.*
