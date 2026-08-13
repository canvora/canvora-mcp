# Canvora CLI — runnable recipes

All examples assume `npm install -g @canvora/cli` and `export CANVORA_API_KEY=vd_...`
(create a key at canvora.ai → Integrations → API Keys — available on the Free plan).

Every command supports `--json` (machine-readable stdout; progress on stderr).

## Promote a blog post — full promo set from one URL

```bash
canvora generate --url https://yourblog.com/post \
  --format blog_header,instagram_carousel,linkedin_post \
  --slides instagram_carousel=6 \
  --brand $BRAND_ID --wait --json
```

## Weekly client content — batch, one brand

```bash
canvora generate --idea "5 hooks that work for boring industries" \
  --format instagram_carousel_portrait --slides instagram_carousel_portrait=6 \
  --brand $BRAND_ID --style bold --wait --json
```

## One campaign, three markets (generate once, localize)

```bash
ID=$(canvora generate --input "One post. Every market. Native content in 150+ languages." \
  --format instagram_post --brand $BRAND_ID --wait --json | jq -r .generation.id)

canvora localize $ID --language es --wait --json
canvora localize $ID --language ar --wait --json
canvora localize $ID --language pt-BR --wait --json
```

## Turn a PDF report into a deck

```bash
canvora generate --file-url https://example.com/q3-report.pdf \
  --format presentation_slide --slides presentation_slide=8 --wait --json
```

## Ad set covering all placements

```bash
canvora generate --url https://yourstore.com/product \
  --format ad_square,ad_landscape,ad_portrait --brand $BRAND_ID --wait --json
```

## Fix one slide without regenerating

```bash
canvora edit $OUTPUT_ID --prompt "make the headline bigger and increase contrast" --yes --json
```

## Generate → schedule (pairs with any posting tool)

```bash
URLS=$(canvora generate --idea "3 mistakes first-time founders make" \
  --format instagram_carousel --slides instagram_carousel=4 --wait --json \
  | jq -r '.generation.outputs | sort_by(.sortOrder) | .[].fileUrl')
# hand $URLS to your scheduler (e.g. postiz, buffer CLI, or your own posting agent)
```

## Housekeeping

```bash
canvora formats --json     # the live format catalog — source of truth for IDs
canvora brands --json      # brand kits (pass with --brand <uuid>)
canvora credits --json     # balance: 10/visual, 15/slide; failed generations auto-refund
canvora status $ID --json  # re-check a generation after a timeout (never re-run generate)
canvora download $ID --dir ./out
```
