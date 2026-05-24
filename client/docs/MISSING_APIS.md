# Missing / Incomplete Backend APIs

Admin frontend integration status. Use this as the implementation backlog for the server.

## Integrated (available now)

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| Products | `GET/POST /products`, `PATCH/DELETE /products/:id`, `GET /products/admin/:id`, image upload/delete |
| Categories | `GET/POST /categories`, `DELETE /categories/:id` |
| Customers | `GET /customers`, `GET /customers/:id`, `DELETE /customers/:id` |
| Orders | `GET /orders`, `GET /orders/stats`, `GET /orders/:id`, `PATCH /orders/:id/status`, `PATCH /orders/:id/payment` |

## Missing — required for full admin UX

### Settings & account

- `PATCH /api/auth/profile` — update `fullName`, `phone`, `address`, avatar
- `POST /api/auth/change-password` — change password while logged in (`currentPassword`, `newPassword`)
- `GET /api/store/settings` — read `StoreSettings` singleton
- `PATCH /api/store/settings` — currency, tax, low stock default, notifications, locale

### Analytics (dashboard widgets)

- `GET /api/analytics/sales?from=&to=` — time series for `SalesAnalyticsChart`
- `GET /api/analytics/popular-products?limit=` — bestsellers for `PopularProductsList`
- `GET /api/analytics/overview` — optional combined dashboard metrics (revenue, growth %)

### Orders

- `GET /api/orders/export?format=csv` — export button on orders page
- Order detail drawer/modal in UI — `GET /orders/:id` exists; wire “View Details” in `OrdersTable`
- Filter `PENDING` vs `PROCESSING` — UI label “Processing” may need `status=PENDING` OR multi-status query

### Products

- `PATCH /api/products/:id/images/:imageId` — set primary / reorder (service exists, **no route**)
- `GET /api/products?admin=true` explicit flag — today relies on cookie role detection

### Categories

- `PATCH /api/categories/:id` — rename / reorder
- `GET /api/categories/:id` — optional

### Customers

- `PATCH /api/customers/:id` — edit profile / reactivate
- Customer soft-delete only; no hard delete (by design)

## Storefront (not in this integration pass)

- Shop catalog → `GET /products` (public)
- Product detail by slug → `GET /products/slug/:slug`
- Checkout → `POST /orders`
- Delivery zones → `GET /delivery-zones`
- Cart persistence server-side

## Suggested implementation order

1. Store settings `GET/PATCH` (unblocks Preferences in admin)
2. `PATCH /auth/profile` + `POST /auth/change-password`
3. Analytics endpoints (sales + popular products)
4. Order export CSV
5. Product image `PATCH` route + order detail modal in UI
