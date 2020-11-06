## API

### Table

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/table`               | `table#create`    |
| GET    | `/table`               | `table#index`     |
| GET    | `/table/:id`           | `table#show`      |
| PATCH  | `/table/:id`           | `table#edit`      |
| DELETE | `/table/:id`           | `table#delete`    |

#### GET /table

Request:

```sh
curl --include --request GET http://localhost:4741/table \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
```

Response:

```md
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

{
  <!-- TODO example response -->
}
```

#### POST /table

Request:

```sh
curl --include --request POST http://localhost:4741/table \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "table": {
      "title": "example Title",
      "description": "example description"
    }
  }'
```

Response:

```md
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  <!-- TODO example response -->
}
```