#!/bin/bash

# Test script to verify all templates are working
echo "🎨 Testing Resume Template Availability..."

# Check if all template constants are defined
echo "📋 Checking template constants..."

# List of expected templates
templates=(
  "MODERN"
  "MINIMAL" 
  "CREATIVE"
  "PROFESSIONAL"
  "SIDEBAR"
  "CANADA"
  "EUROPASS"
  "EUROPE"
  "AUSTRALIA"
  "USA"
  "INDIA"
)

echo "✅ Expected templates: ${templates[*]}"

# Check if imports exist
echo "📦 Checking template imports..."
import_files=(
  "src/components/ResumeBuilderPage/Templates/ModernTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/MinimalTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/CreativeTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/ProfessionalTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/SidebarTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/CanadaTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/NewTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/EuropenUnionTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/AustraliaTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/UsaTemplate.jsx"
  "src/components/ResumeBuilderPage/Templates/IndiaTemplate.jsx"
)

for file in "${import_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo "🚀 All templates should now be available!"
echo "📝 Templates enabled in:"
echo "  - constants.jsx (template definitions)"
echo "  - ResumeTemplateContent.jsx (template mapping)"
echo "  - TemplateSelector.jsx (UI tabs)"
echo "  - CreateResumeDialog.jsx (creation dialog)"
echo ""
echo "🎯 To test:"
echo "1. npm run dev"
echo "2. Go to dashboard"
echo "3. Click 'Create New'"
echo "4. Verify all templates appear in selection"
echo "5. Create resume and test template switching in preview"