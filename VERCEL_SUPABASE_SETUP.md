# BlueLog v2 - Vercel + Supabase setup

Deze patch laat de huidige Next.js frontend, MapLibre/MapTiler kaart en bestaande
BlueLog formulieren intact. Alleen de API achter `/api/...` wordt vervangen door
Next.js route handlers die centraal in Supabase opslaan.

## 1. Bestanden kopiëren

Kopieer de mappen `app`, `lib` en `supabase` uit deze patch over je repo heen.
Bestaande bestanden die niet in de patch zitten blijven gewoon staan.

## 2. Supabase dependency

Voeg aan `dependencies` in `package.json` toe:

```json
"@supabase/supabase-js": "^2.57.4"
```

Voer daarna `npm install` uit en commit ook de gewijzigde `package-lock.json`.

## 3. Database maken

Open in Supabase: SQL Editor.

Voer eerst uit:
- `supabase/schema.sql`

Voer daarna uit:
- `supabase/seed-dive-sites.sql`

De bekende duikplekken uit de bestaande BlueLog seed zijn daarmee centraal
beschikbaar voor Nederland en Curaçao.

## 4. Vercel environment variables

Zet in Vercel bij Project > Settings > Environment Variables:

- `SUPABASE_URL` = Project URL uit Supabase
- `SUPABASE_SERVICE_ROLE_KEY` = service-role key uit Supabase
- `NEXT_PUBLIC_API_URL` = `/api`
- `NEXT_PUBLIC_MAPTILER_KEY` = dezelfde MapTiler key die BlueLog nu al gebruikt

BELANGRIJK:
`SUPABASE_SERVICE_ROLE_KEY` mag NOOIT `NEXT_PUBLIC_` heten en mag niet in browsercode
terechtkomen. De meegeleverde `lib/supabaseAdmin.ts` wordt uitsluitend door server
route handlers gebruikt.

## 5. GPS op telefoon

De huidige `components/DiveForm.tsx` gebruikt al `navigator.geolocation` met
`enableHighAccuracy: true`. Op Vercel wordt de site via HTTPS aangeboden, waardoor
de browser na toestemming de GPS-locatie kan gebruiken.

Flow:
1. Nieuwe duik openen.
2. "Huidige locatie" gebruiken in de bestaande locatie-sectie.
3. Latitude/longitude worden in de Dive gezet.
4. Na opslaan gaan ze naar Supabase.
5. De bestaande `DiveMap` toont duiken met latitude/longitude automatisch als pin.

Zie `components/DiveForm.GPS.patch.txt` voor een kleine optionele verbetering van
de locatienaam.

## 6. Kaart

Geen kaartwissel nodig. De bestaande `DiveMap.tsx` gebruikt MapLibre met de
MapTiler satellite style en maakt al markers voor elke Dive met latitude/longitude.

## 7. Deployment

Push de patch naar GitHub. Als je Vercel-project met deze repo verbonden is, start
Vercel automatisch een nieuwe deployment.

## Opmerking over foto's

De huidige servermap bevat een lokale upload-opzet. Die is niet geschikt als
permanente opslag op Vercel. Deze patch migreert nu duiken, GPS-locaties,
duiklocaties en buddies naar Supabase. Foto's kun je daarna het beste naar
Supabase Storage migreren.
