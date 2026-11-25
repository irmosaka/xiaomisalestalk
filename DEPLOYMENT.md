# Internal deployment checklist

1. Change the repository visibility to Private and restrict access to approved staff.
2. Verify that the organization/hosting platform enforces SSO or VPN before serving the app.
3. Do not treat a private GitHub repository as proof that the published site is private.
4. Use GitHub Enterprise Cloud private Pages only when the organization has that capability; otherwise publish behind the corporate web gateway.
5. Confirm that no pricing, cost, inventory, margin, or supplier-only data is included in the published build.
6. Test the app from a staff account and from a non-authorized account; the latter must be denied by the hosting layer.
7. Set a content owner and review date for each product playbook.
