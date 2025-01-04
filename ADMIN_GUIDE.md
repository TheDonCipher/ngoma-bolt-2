# Admin Guide

## Admin Configuration

1. Configure Admin Addresses
```env
# In .env file
ADMIN_ADDRESSES=["0x123...","0x456..."] # Your admin wallet addresses
```

2. Admin Roles & Permissions
- MANAGE_USERS: User management and moderation
- MANAGE_CONTENT: Content moderation and removal
- MANAGE_SETTINGS: Platform configuration
- VIEW_ANALYTICS: Access to analytics dashboard
- MODERATE_CONTENT: Content review and approval

## Admin Features

### User Management
- View and manage user accounts
- Suspend/ban users
- Reset user passwords
- Manage user roles

### Content Moderation
- Review and approve new content
- Remove violating content
- Manage content reports
- Set content visibility

### System Settings
- Platform fees configuration
- Royalty fee limits
- Maintenance mode toggle
- Automatic moderation settings

### Analytics Dashboard
- User statistics
- Transaction volume
- Platform revenue
- System health metrics

### Audit Logs
- View system activity
- Track security events
- Export audit data
- Set retention policies

## Security Best Practices
1. Use hardware wallets for admin accounts
2. Enable 2FA where possible
3. Regularly rotate access credentials
4. Monitor audit logs for suspicious activity
5. Follow least privilege principle
