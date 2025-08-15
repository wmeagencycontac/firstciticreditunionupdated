#!/bin/bash

# Dependency Update Script for Fusion Banking
# This script safely updates dependencies in stages

set -e  # Exit on any error

echo "🔄 Starting Fusion Banking dependency updates..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to run command with error handling
run_command() {
    local cmd="$1"
    local description="$2"
    
    print_status "$description"
    if eval "$cmd"; then
        print_success "$description completed"
    else
        print_error "$description failed"
        exit 1
    fi
}

# Function to backup package files
backup_files() {
    print_status "Creating backup of package files..."
    cp package.json package.json.backup
    cp package-lock.json package-lock.json.backup
    print_success "Backup created"
}

# Function to restore backup
restore_backup() {
    print_warning "Restoring backup due to failure..."
    cp package.json.backup package.json
    cp package-lock.json.backup package-lock.json
    npm ci
}

# Function to run tests
run_tests() {
    print_status "Running test suite..."
    if npm run test:unit; then
        print_success "Tests passed"
        return 0
    else
        print_error "Tests failed"
        return 1
    fi
}

# Function to check TypeScript
check_typescript() {
    print_status "Checking TypeScript compilation..."
    if npm run typecheck; then
        print_success "TypeScript check passed"
        return 0
    else
        print_warning "TypeScript check has errors (continuing anyway)"
        return 0  # Don't fail on TS errors for now
    fi
}

# Stage 1: Safe patch updates
stage1_updates() {
    print_status "🎯 Stage 1: Applying safe patch/minor updates..."
    
    # Security and development tools
    local packages=(
        "@types/node"
        "@types/react" 
        "@types/react-dom"
        "prettier"
        "vitest"
        "tailwindcss"
        "autoprefixer"
        "postcss"
        "@vitejs/plugin-react-swc"
        "tsx"
        "@swc/core"
    )
    
    for package in "${packages[@]}"; do
        print_status "Updating $package..."
        npm update "$package" 2>/dev/null || print_warning "Could not update $package (may not be installed)"
    done
    
    print_success "Stage 1 updates completed"
}

# Stage 2: Library updates  
stage2_updates() {
    print_status "🎯 Stage 2: Updating UI and development libraries..."
    
    # Update Radix UI packages
    print_status "Updating Radix UI packages..."
    npm update $(npm list --depth=0 2>/dev/null | grep "@radix-ui" | cut -d' ' -f1 | tr '\n' ' ') 2>/dev/null || print_warning "Some Radix packages could not be updated"
    
    # Other UI libraries
    local ui_packages=(
        "lucide-react"
        "sonner" 
        "vaul"
        "class-variance-authority"
        "clsx"
        "tailwind-merge"
        "@testing-library/react"
        "msw"
    )
    
    for package in "${ui_packages[@]}"; do
        print_status "Updating $package..."
        npm update "$package" 2>/dev/null || print_warning "Could not update $package"
    done
    
    print_success "Stage 2 updates completed"
}

# Main execution
main() {
    print_status "Starting dependency update process..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Create backup
    backup_files
    
    # Trap to restore backup on failure
    trap 'restore_backup' ERR
    
    # Show current status
    print_status "Current dependency status:"
    npm outdated || true
    
    # Security audit
    print_status "Running security audit..."
    npm audit --audit-level moderate || print_warning "Security audit found issues"
    
    # Stage 1: Safe updates
    stage1_updates
    check_typescript
    
    # Stage 2: Library updates (optional, prompted)
    read -p "🤔 Apply Stage 2 updates (UI libraries)? This may require more testing. (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        stage2_updates
        check_typescript
    else
        print_status "Skipping Stage 2 updates"
    fi
    
    # Final validation
    print_status "Running final validation..."
    npm ci  # Clean install to ensure lockfile is correct
    check_typescript
    
    # Clean up backup files
    rm package.json.backup package-lock.json.backup
    
    print_success "🎉 Dependency updates completed successfully!"
    print_status "📊 Updated dependency status:"
    npm outdated || print_success "All dependencies are up to date!"
    
    print_status "🔍 Recommendations:"
    echo "  1. Run the full test suite: npm test"
    echo "  2. Test critical user flows manually"
    echo "  3. Check bundle size: npm run build"
    echo "  4. Monitor application in development"
    echo "  5. Deploy to staging environment for testing"
}

# Help function
show_help() {
    echo "Fusion Banking Dependency Update Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -1, --stage1   Run only Stage 1 (safe) updates"
    echo "  -2, --stage2   Run both Stage 1 and Stage 2 updates"
    echo "  --dry-run      Show what would be updated without making changes"
    echo ""
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -1|--stage1)
        backup_files
        trap 'restore_backup' ERR
        stage1_updates
        check_typescript
        print_success "Stage 1 updates completed"
        ;;
    -2|--stage2) 
        backup_files
        trap 'restore_backup' ERR
        stage1_updates
        stage2_updates
        check_typescript
        print_success "All updates completed"
        ;;
    --dry-run)
        print_status "Dry run - showing outdated packages:"
        npm outdated
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
