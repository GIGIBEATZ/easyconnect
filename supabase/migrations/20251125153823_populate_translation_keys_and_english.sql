/*
  # Populate Translation Keys and English Base Translations

  1. Insert translation keys organized by namespace
  2. Insert English translations for all keys
  
  Namespaces:
    - common: General UI elements
    - nav: Navigation items
    - auth: Authentication related
    - marketplace: Product marketplace
    - jobs: Job board
    - forms: Form labels and validation
    - messages: Success/error messages
    - footer: Footer links and content
    - settings: Settings page
    - cart: Shopping cart
    - profile: User profile
*/

-- Common namespace
INSERT INTO translation_keys (key, namespace, context) VALUES
  ('common.welcome', 'common', 'Welcome message'),
  ('common.home', 'common', 'Home link'),
  ('common.back', 'common', 'Back button'),
  ('common.next', 'common', 'Next button'),
  ('common.previous', 'common', 'Previous button'),
  ('common.save', 'common', 'Save button'),
  ('common.cancel', 'common', 'Cancel button'),
  ('common.delete', 'common', 'Delete button'),
  ('common.edit', 'common', 'Edit button'),
  ('common.add', 'common', 'Add button'),
  ('common.remove', 'common', 'Remove button'),
  ('common.search', 'common', 'Search'),
  ('common.filter', 'common', 'Filter'),
  ('common.sort', 'common', 'Sort'),
  ('common.loading', 'common', 'Loading state'),
  ('common.error', 'common', 'Error message'),
  ('common.success', 'common', 'Success message'),
  ('common.confirm', 'common', 'Confirm button'),
  ('common.yes', 'common', 'Yes'),
  ('common.no', 'common', 'No'),
  ('common.close', 'common', 'Close'),
  ('common.viewAll', 'common', 'View all'),
  ('common.learnMore', 'common', 'Learn more'),
  ('common.submit', 'common', 'Submit'),
  ('common.continue', 'common', 'Continue'),
  ('common.skip', 'common', 'Skip'),
  ('common.or', 'common', 'Or'),
  ('common.and', 'common', 'And')
ON CONFLICT (key) DO NOTHING;

-- Navigation namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('nav.marketplace', 'nav'),
  ('nav.jobs', 'nav'),
  ('nav.cart', 'nav'),
  ('nav.wishlist', 'nav'),
  ('nav.orders', 'nav'),
  ('nav.profile', 'nav'),
  ('nav.settings', 'nav'),
  ('nav.help', 'nav'),
  ('nav.contact', 'nav'),
  ('nav.about', 'nav'),
  ('nav.dashboard', 'nav'),
  ('nav.myProducts', 'nav'),
  ('nav.myJobs', 'nav'),
  ('nav.myApplications', 'nav'),
  ('nav.notifications', 'nav'),
  ('nav.categories', 'nav'),
  ('nav.deals', 'nav'),
  ('nav.recent', 'nav')
ON CONFLICT (key) DO NOTHING;

-- Auth namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('auth.signIn', 'auth'),
  ('auth.signUp', 'auth'),
  ('auth.signOut', 'auth'),
  ('auth.email', 'auth'),
  ('auth.password', 'auth'),
  ('auth.confirmPassword', 'auth'),
  ('auth.fullName', 'auth'),
  ('auth.forgotPassword', 'auth'),
  ('auth.resetPassword', 'auth'),
  ('auth.createAccount', 'auth'),
  ('auth.alreadyHaveAccount', 'auth'),
  ('auth.dontHaveAccount', 'auth'),
  ('auth.rememberMe', 'auth'),
  ('auth.welcomeBack', 'auth'),
  ('auth.getStarted', 'auth')
ON CONFLICT (key) DO NOTHING;

-- Marketplace namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('marketplace.products', 'marketplace'),
  ('marketplace.categories', 'marketplace'),
  ('marketplace.price', 'marketplace'),
  ('marketplace.condition', 'marketplace'),
  ('marketplace.brand', 'marketplace'),
  ('marketplace.shipping', 'marketplace'),
  ('marketplace.description', 'marketplace'),
  ('marketplace.reviews', 'marketplace'),
  ('marketplace.addToCart', 'marketplace'),
  ('marketplace.buyNow', 'marketplace'),
  ('marketplace.seller', 'marketplace'),
  ('marketplace.inStock', 'marketplace'),
  ('marketplace.outOfStock', 'marketplace'),
  ('marketplace.newArrival', 'marketplace'),
  ('marketplace.featured', 'marketplace'),
  ('marketplace.onSale', 'marketplace'),
  ('marketplace.viewDetails', 'marketplace'),
  ('marketplace.addProduct', 'marketplace'),
  ('marketplace.searchProducts', 'marketplace')
ON CONFLICT (key) DO NOTHING;

-- Jobs namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('jobs.title', 'jobs'),
  ('jobs.company', 'jobs'),
  ('jobs.location', 'jobs'),
  ('jobs.salary', 'jobs'),
  ('jobs.jobType', 'jobs'),
  ('jobs.applyNow', 'jobs'),
  ('jobs.description', 'jobs'),
  ('jobs.requirements', 'jobs'),
  ('jobs.benefits', 'jobs'),
  ('jobs.postedOn', 'jobs'),
  ('jobs.deadline', 'jobs'),
  ('jobs.fullTime', 'jobs'),
  ('jobs.partTime', 'jobs'),
  ('jobs.contract', 'jobs'),
  ('jobs.remote', 'jobs'),
  ('jobs.onsite', 'jobs'),
  ('jobs.hybrid', 'jobs'),
  ('jobs.postJob', 'jobs'),
  ('jobs.applications', 'jobs')
ON CONFLICT (key) DO NOTHING;

-- Forms namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('forms.required', 'forms'),
  ('forms.invalid', 'forms'),
  ('forms.tooShort', 'forms'),
  ('forms.tooLong', 'forms'),
  ('forms.mustMatch', 'forms'),
  ('forms.invalidEmail', 'forms'),
  ('forms.invalidPhone', 'forms'),
  ('forms.invalidUrl', 'forms'),
  ('forms.selectOption', 'forms'),
  ('forms.uploadFile', 'forms'),
  ('forms.dragDrop', 'forms')
ON CONFLICT (key) DO NOTHING;

-- Messages namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('messages.itemAdded', 'messages'),
  ('messages.itemRemoved', 'messages'),
  ('messages.orderPlaced', 'messages'),
  ('messages.profileUpdated', 'messages'),
  ('messages.errorOccurred', 'messages'),
  ('messages.tryAgain', 'messages'),
  ('messages.contactSupport', 'messages'),
  ('messages.changesSaved', 'messages'),
  ('messages.deleteConfirm', 'messages')
ON CONFLICT (key) DO NOTHING;

-- Footer namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('footer.aboutUs', 'footer'),
  ('footer.careers', 'footer'),
  ('footer.blog', 'footer'),
  ('footer.help', 'footer'),
  ('footer.contact', 'footer'),
  ('footer.privacy', 'footer'),
  ('footer.terms', 'footer'),
  ('footer.refund', 'footer'),
  ('footer.newsletter', 'footer'),
  ('footer.followUs', 'footer'),
  ('footer.backToTop', 'footer'),
  ('footer.allRightsReserved', 'footer')
ON CONFLICT (key) DO NOTHING;

-- Settings namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('settings.general', 'settings'),
  ('settings.account', 'settings'),
  ('settings.security', 'settings'),
  ('settings.notifications', 'settings'),
  ('settings.language', 'settings'),
  ('settings.theme', 'settings'),
  ('settings.preferences', 'settings')
ON CONFLICT (key) DO NOTHING;

-- Cart namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('cart.title', 'cart'),
  ('cart.empty', 'cart'),
  ('cart.subtotal', 'cart'),
  ('cart.total', 'cart'),
  ('cart.checkout', 'cart'),
  ('cart.continueShopping', 'cart'),
  ('cart.items', 'cart'),
  ('cart.quantity', 'cart')
ON CONFLICT (key) DO NOTHING;

-- Profile namespace
INSERT INTO translation_keys (key, namespace) VALUES
  ('profile.personal', 'profile'),
  ('profile.address', 'profile'),
  ('profile.payment', 'profile'),
  ('profile.orders', 'profile'),
  ('profile.wishlist', 'profile')
ON CONFLICT (key) DO NOTHING;

-- Now insert English translations
INSERT INTO translations (key_id, language_code, value, is_verified)
SELECT tk.id, 'en', 
  CASE tk.key
    -- Common
    WHEN 'common.welcome' THEN 'Welcome'
    WHEN 'common.home' THEN 'Home'
    WHEN 'common.back' THEN 'Back'
    WHEN 'common.next' THEN 'Next'
    WHEN 'common.previous' THEN 'Previous'
    WHEN 'common.save' THEN 'Save'
    WHEN 'common.cancel' THEN 'Cancel'
    WHEN 'common.delete' THEN 'Delete'
    WHEN 'common.edit' THEN 'Edit'
    WHEN 'common.add' THEN 'Add'
    WHEN 'common.remove' THEN 'Remove'
    WHEN 'common.search' THEN 'Search'
    WHEN 'common.filter' THEN 'Filter'
    WHEN 'common.sort' THEN 'Sort'
    WHEN 'common.loading' THEN 'Loading...'
    WHEN 'common.error' THEN 'Error'
    WHEN 'common.success' THEN 'Success'
    WHEN 'common.confirm' THEN 'Confirm'
    WHEN 'common.yes' THEN 'Yes'
    WHEN 'common.no' THEN 'No'
    WHEN 'common.close' THEN 'Close'
    WHEN 'common.viewAll' THEN 'View All'
    WHEN 'common.learnMore' THEN 'Learn More'
    WHEN 'common.submit' THEN 'Submit'
    WHEN 'common.continue' THEN 'Continue'
    WHEN 'common.skip' THEN 'Skip'
    WHEN 'common.or' THEN 'Or'
    WHEN 'common.and' THEN 'And'
    -- Nav
    WHEN 'nav.marketplace' THEN 'Marketplace'
    WHEN 'nav.jobs' THEN 'Jobs'
    WHEN 'nav.cart' THEN 'Cart'
    WHEN 'nav.wishlist' THEN 'Wishlist'
    WHEN 'nav.orders' THEN 'Orders'
    WHEN 'nav.profile' THEN 'Profile'
    WHEN 'nav.settings' THEN 'Settings'
    WHEN 'nav.help' THEN 'Help'
    WHEN 'nav.contact' THEN 'Contact'
    WHEN 'nav.about' THEN 'About'
    WHEN 'nav.dashboard' THEN 'Dashboard'
    WHEN 'nav.myProducts' THEN 'My Products'
    WHEN 'nav.myJobs' THEN 'My Jobs'
    WHEN 'nav.myApplications' THEN 'My Applications'
    WHEN 'nav.notifications' THEN 'Notifications'
    WHEN 'nav.categories' THEN 'Categories'
    WHEN 'nav.deals' THEN 'Deals'
    WHEN 'nav.recent' THEN 'Recently Viewed'
    -- Auth
    WHEN 'auth.signIn' THEN 'Sign In'
    WHEN 'auth.signUp' THEN 'Sign Up'
    WHEN 'auth.signOut' THEN 'Sign Out'
    WHEN 'auth.email' THEN 'Email'
    WHEN 'auth.password' THEN 'Password'
    WHEN 'auth.confirmPassword' THEN 'Confirm Password'
    WHEN 'auth.fullName' THEN 'Full Name'
    WHEN 'auth.forgotPassword' THEN 'Forgot Password?'
    WHEN 'auth.resetPassword' THEN 'Reset Password'
    WHEN 'auth.createAccount' THEN 'Create Account'
    WHEN 'auth.alreadyHaveAccount' THEN 'Already have an account?'
    WHEN 'auth.dontHaveAccount' THEN 'Don''t have an account?'
    WHEN 'auth.rememberMe' THEN 'Remember me'
    WHEN 'auth.welcomeBack' THEN 'Welcome back!'
    WHEN 'auth.getStarted' THEN 'Get started'
    -- Marketplace
    WHEN 'marketplace.products' THEN 'Products'
    WHEN 'marketplace.categories' THEN 'Categories'
    WHEN 'marketplace.price' THEN 'Price'
    WHEN 'marketplace.condition' THEN 'Condition'
    WHEN 'marketplace.brand' THEN 'Brand'
    WHEN 'marketplace.shipping' THEN 'Shipping'
    WHEN 'marketplace.description' THEN 'Description'
    WHEN 'marketplace.reviews' THEN 'Reviews'
    WHEN 'marketplace.addToCart' THEN 'Add to Cart'
    WHEN 'marketplace.buyNow' THEN 'Buy Now'
    WHEN 'marketplace.seller' THEN 'Seller'
    WHEN 'marketplace.inStock' THEN 'In Stock'
    WHEN 'marketplace.outOfStock' THEN 'Out of Stock'
    WHEN 'marketplace.newArrival' THEN 'New Arrival'
    WHEN 'marketplace.featured' THEN 'Featured'
    WHEN 'marketplace.onSale' THEN 'On Sale'
    WHEN 'marketplace.viewDetails' THEN 'View Details'
    WHEN 'marketplace.addProduct' THEN 'Add Product'
    WHEN 'marketplace.searchProducts' THEN 'Search products, jobs, and more...'
    -- Jobs
    WHEN 'jobs.title' THEN 'Job Title'
    WHEN 'jobs.company' THEN 'Company'
    WHEN 'jobs.location' THEN 'Location'
    WHEN 'jobs.salary' THEN 'Salary'
    WHEN 'jobs.jobType' THEN 'Job Type'
    WHEN 'jobs.applyNow' THEN 'Apply Now'
    WHEN 'jobs.description' THEN 'Description'
    WHEN 'jobs.requirements' THEN 'Requirements'
    WHEN 'jobs.benefits' THEN 'Benefits'
    WHEN 'jobs.postedOn' THEN 'Posted On'
    WHEN 'jobs.deadline' THEN 'Application Deadline'
    WHEN 'jobs.fullTime' THEN 'Full-time'
    WHEN 'jobs.partTime' THEN 'Part-time'
    WHEN 'jobs.contract' THEN 'Contract'
    WHEN 'jobs.remote' THEN 'Remote'
    WHEN 'jobs.onsite' THEN 'On-site'
    WHEN 'jobs.hybrid' THEN 'Hybrid'
    WHEN 'jobs.postJob' THEN 'Post a Job'
    WHEN 'jobs.applications' THEN 'Applications'
    -- Forms
    WHEN 'forms.required' THEN 'This field is required'
    WHEN 'forms.invalid' THEN 'Invalid format'
    WHEN 'forms.tooShort' THEN 'Too short'
    WHEN 'forms.tooLong' THEN 'Too long'
    WHEN 'forms.mustMatch' THEN 'Fields must match'
    WHEN 'forms.invalidEmail' THEN 'Invalid email address'
    WHEN 'forms.invalidPhone' THEN 'Invalid phone number'
    WHEN 'forms.invalidUrl' THEN 'Invalid URL'
    WHEN 'forms.selectOption' THEN 'Please select an option'
    WHEN 'forms.uploadFile' THEN 'Upload a file'
    WHEN 'forms.dragDrop' THEN 'Drag and drop or click to upload'
    -- Messages
    WHEN 'messages.itemAdded' THEN 'Item added to cart'
    WHEN 'messages.itemRemoved' THEN 'Item removed from cart'
    WHEN 'messages.orderPlaced' THEN 'Order placed successfully'
    WHEN 'messages.profileUpdated' THEN 'Profile updated successfully'
    WHEN 'messages.errorOccurred' THEN 'An error occurred'
    WHEN 'messages.tryAgain' THEN 'Please try again'
    WHEN 'messages.contactSupport' THEN 'Contact support'
    WHEN 'messages.changesSaved' THEN 'Changes saved'
    WHEN 'messages.deleteConfirm' THEN 'Are you sure you want to delete this?'
    -- Footer
    WHEN 'footer.aboutUs' THEN 'About Us'
    WHEN 'footer.careers' THEN 'Careers'
    WHEN 'footer.blog' THEN 'Blog'
    WHEN 'footer.help' THEN 'Help Center'
    WHEN 'footer.contact' THEN 'Contact Us'
    WHEN 'footer.privacy' THEN 'Privacy Policy'
    WHEN 'footer.terms' THEN 'Terms of Service'
    WHEN 'footer.refund' THEN 'Refund Policy'
    WHEN 'footer.newsletter' THEN 'Subscribe to Newsletter'
    WHEN 'footer.followUs' THEN 'Follow Us'
    WHEN 'footer.backToTop' THEN 'Back to top'
    WHEN 'footer.allRightsReserved' THEN 'All rights reserved'
    -- Settings
    WHEN 'settings.general' THEN 'General'
    WHEN 'settings.account' THEN 'Account'
    WHEN 'settings.security' THEN 'Security'
    WHEN 'settings.notifications' THEN 'Notifications'
    WHEN 'settings.language' THEN 'Language'
    WHEN 'settings.theme' THEN 'Theme'
    WHEN 'settings.preferences' THEN 'Preferences'
    -- Cart
    WHEN 'cart.title' THEN 'Shopping Cart'
    WHEN 'cart.empty' THEN 'Your cart is empty'
    WHEN 'cart.subtotal' THEN 'Subtotal'
    WHEN 'cart.total' THEN 'Total'
    WHEN 'cart.checkout' THEN 'Checkout'
    WHEN 'cart.continueShopping' THEN 'Continue Shopping'
    WHEN 'cart.items' THEN '{{count}} items'
    WHEN 'cart.quantity' THEN 'Quantity'
    -- Profile
    WHEN 'profile.personal' THEN 'Personal Information'
    WHEN 'profile.address' THEN 'Addresses'
    WHEN 'profile.payment' THEN 'Payment Methods'
    WHEN 'profile.orders' THEN 'Order History'
    WHEN 'profile.wishlist' THEN 'Wishlist'
  END,
  true
FROM translation_keys tk
WHERE tk.key IN (
  'common.welcome', 'common.home', 'common.back', 'common.next', 'common.previous', 'common.save', 'common.cancel', 
  'common.delete', 'common.edit', 'common.add', 'common.remove', 'common.search', 'common.filter', 'common.sort', 
  'common.loading', 'common.error', 'common.success', 'common.confirm', 'common.yes', 'common.no', 'common.close', 
  'common.viewAll', 'common.learnMore', 'common.submit', 'common.continue', 'common.skip', 'common.or', 'common.and',
  'nav.marketplace', 'nav.jobs', 'nav.cart', 'nav.wishlist', 'nav.orders', 'nav.profile', 'nav.settings', 'nav.help', 
  'nav.contact', 'nav.about', 'nav.dashboard', 'nav.myProducts', 'nav.myJobs', 'nav.myApplications', 'nav.notifications', 
  'nav.categories', 'nav.deals', 'nav.recent',
  'auth.signIn', 'auth.signUp', 'auth.signOut', 'auth.email', 'auth.password', 'auth.confirmPassword', 'auth.fullName', 
  'auth.forgotPassword', 'auth.resetPassword', 'auth.createAccount', 'auth.alreadyHaveAccount', 'auth.dontHaveAccount', 
  'auth.rememberMe', 'auth.welcomeBack', 'auth.getStarted',
  'marketplace.products', 'marketplace.categories', 'marketplace.price', 'marketplace.condition', 'marketplace.brand', 
  'marketplace.shipping', 'marketplace.description', 'marketplace.reviews', 'marketplace.addToCart', 'marketplace.buyNow', 
  'marketplace.seller', 'marketplace.inStock', 'marketplace.outOfStock', 'marketplace.newArrival', 'marketplace.featured', 
  'marketplace.onSale', 'marketplace.viewDetails', 'marketplace.addProduct', 'marketplace.searchProducts',
  'jobs.title', 'jobs.company', 'jobs.location', 'jobs.salary', 'jobs.jobType', 'jobs.applyNow', 'jobs.description', 
  'jobs.requirements', 'jobs.benefits', 'jobs.postedOn', 'jobs.deadline', 'jobs.fullTime', 'jobs.partTime', 
  'jobs.contract', 'jobs.remote', 'jobs.onsite', 'jobs.hybrid', 'jobs.postJob', 'jobs.applications',
  'forms.required', 'forms.invalid', 'forms.tooShort', 'forms.tooLong', 'forms.mustMatch', 'forms.invalidEmail', 
  'forms.invalidPhone', 'forms.invalidUrl', 'forms.selectOption', 'forms.uploadFile', 'forms.dragDrop',
  'messages.itemAdded', 'messages.itemRemoved', 'messages.orderPlaced', 'messages.profileUpdated', 'messages.errorOccurred', 
  'messages.tryAgain', 'messages.contactSupport', 'messages.changesSaved', 'messages.deleteConfirm',
  'footer.aboutUs', 'footer.careers', 'footer.blog', 'footer.help', 'footer.contact', 'footer.privacy', 'footer.terms', 
  'footer.refund', 'footer.newsletter', 'footer.followUs', 'footer.backToTop', 'footer.allRightsReserved',
  'settings.general', 'settings.account', 'settings.security', 'settings.notifications', 'settings.language', 
  'settings.theme', 'settings.preferences',
  'cart.title', 'cart.empty', 'cart.subtotal', 'cart.total', 'cart.checkout', 'cart.continueShopping', 'cart.items', 'cart.quantity',
  'profile.personal', 'profile.address', 'profile.payment', 'profile.orders', 'profile.wishlist'
)
ON CONFLICT (key_id, language_code) DO NOTHING;
