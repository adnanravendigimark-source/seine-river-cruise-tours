import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

// Read DATABASE_URL from .env if not in process.env
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const articleContent = `<p>Understanding <strong>where do Seine river cruises depart</strong> is essential when planning your Paris sightseeing. While the Seine River winds past world-famous monuments, Paris has no single central boat terminal. Instead, commercial embarkation piers—known locally as <em>ports</em> or <em>embarcadères</em>—are distributed along both the Left Bank (Rive Gauche) and Right Bank (Rive Droite). Arriving on the wrong riverbank can cause you to miss your scheduled sailing.</p>

<p>Whether you have booked a one-hour sightseeing cruise, an evening sunset tour, or an upscale dinner cruise, this guide details every major Seine cruise departure pier across central Paris, including nearby Metro stations, landmark proximities, and boarding recommendations.</p>

<h2>Port de la Bourdonnais: Directly at the Eiffel Tower</h2>
<p>If you have booked a standard Seine sightseeing boat tour near the Iron Lady, your boarding point is almost certainly <strong>Port de la Bourdonnais</strong>. Positioned along the Left Bank in the 7th arrondissement, this pier sits directly beneath the southern approach to <strong>Pont d'Iéna</strong>.</p>
<p>Port de la Bourdonnais serves as the main base for <strong>Bateaux Parisiens</strong>, one of Paris's largest river tour operators. The quayside features numbered pontoons over the river. Sightseeing cruises generally depart from Ponton 3, while dinner and lunch cruises board from dedicated hospitality pontoons slightly further downstream.</p>

<figure>
  <img src="https://vel8aqzfqfybmsb2.public.blob.vercel-storage.com/uploads/1786807693749-wtrlhb-vCZNc9EHi3KmLZ2BbAQIFZejUQLKi8.png" alt="Sightseeing cruise boat departing from Port de la Bourdonnais pontoon beneath the Eiffel Tower in Paris" />
  <figcaption>Port de la Bourdonnais at the foot of the Eiffel Tower is Paris's busiest Seine cruise departure pier.</figcaption>
</figure>

<h3>Reaching Port de la Bourdonnais</h3>
<ul>
  <li><strong>Metro:</strong> Bir-Hakeim (Line 6) is a 10-minute walk. Trocadéro (Lines 6 and 9) provides a scenic stroll across Pont d'Iéna.</li>
  <li><strong>RER:</strong> Champ de Mars - Tour Eiffel (RER C) is only 400 meters away.</li>
  <li><strong>Quay Access:</strong> Take the pedestrian stairs or ramps down from Quai Branly onto the port.</li>
</ul>

<h2>Port de la Conférence & Pont de l'Alma: Right Bank Departures</h2>
<p>Located on the Right Bank in the 8th arrondissement, <strong>Port de la Conférence</strong> is situated next to <strong>Pont de l'Alma</strong> and the Flame of Liberty memorial. This expansive riverfront terminal is the exclusive headquarters of <strong>Compagnie des Bateaux-Mouches</strong>, operating on the Seine since 1949.</p>
<p>Port de la Conférence features a two-story glass reception building with sheltered waiting rooms, ticket kiosks, and pre-boarding terraces. The fleet consists of classic double-decker vessels with open upper-deck seating, offering 360-degree views of the Paris skyline.</p>

<h3>Reaching Port de la Conférence</h3>
<ul>
  <li><strong>Metro:</strong> Alma-Marceau (Line 9) is 150 meters away. Exit toward Avenue Montaigne and descend to the river bank.</li>
  <li><strong>RER:</strong> Pont de l'Alma (RER C) sits just across the bridge on the Left Bank.</li>
</ul>

<h2>Pont Neuf & Square du Vert-Galant: Île de la Cité</h2>
<p>For visitors exploring Notre-Dame Cathedral or Sainte-Chapelle, the most atmospheric departure point in Paris is at the western tip of <strong>Île de la Cité</strong>. Nestled beneath the stone arches of <strong>Pont Neuf</strong>—the oldest bridge in Paris—this boarding location is operated by <strong>Vedettes du Pont Neuf</strong>.</p>
<p>Departing from Square du Vert-Galant provides a distinctly historic starting point. Because Île de la Cité sits in the heart of historic Paris, cruises departing here begin their journey surrounded by medieval masonry, the Conciergerie, and the Louvre before cruising toward the Eiffel Tower.</p>

<figure>
  <img src="https://vel8aqzfqfybmsb2.public.blob.vercel-storage.com/uploads/1786953546526-vhyuaa-aM8Bxgk2spTdeGmkw9wfreZEmLHT9U.png" alt="Seine River cruise boat approaching Pont Neuf pier near Île de la Cité and Square du Vert-Galant" />
  <figcaption>Vedettes du Pont Neuf operates departures from the historic tip of Île de la Cité right below Pont Neuf.</figcaption>
</figure>

<h3>Reaching Pont Neuf Pier</h3>
<ul>
  <li><strong>Metro:</strong> Pont Neuf (Line 7) is under 3 minutes away. Cité (Line 4) on the island is a 5-minute walk.</li>
  <li><strong>RER:</strong> Saint-Michel Notre-Dame (RER B and C) is a convenient 7-minute walk across the bridge.</li>
</ul>

<h2>Port de Suffren & Port de Solférino: Boutique & Dining Piers</h2>
<p>Two additional piers host specialized itineraries. Situated just south of the Eiffel Tower on the Left Bank, <strong>Port de Suffren</strong> is home to <strong>Vedettes de Paris</strong>, known for modern electric-hybrid catamarans and aperitif cruises. Further east along the Left Bank opposite Musée d'Orsay, <strong>Port de Solférino</strong> serves as the launch point for culinary specialists like <strong>Paris Seine (La Marina)</strong>, hosting gourmet multi-course dinner cruises.</p>

<figure>
  <img src="https://vel8aqzfqfybmsb2.public.blob.vercel-storage.com/uploads/1786957295524-nj0iol-QHMpNAAssGYsheUKQwJCw6zNDWwvzC.png" alt="Illuminated evening Seine River dining cruise boat departing near Musée d'Orsay and Port de Solférino" />
  <figcaption>Port de Solférino directly opposite the Louvre and Musée d'Orsay serves romantic evening dining cruises.</figcaption>
</figure>

<h2>Seine River Cruise Departure Piers at a Glance</h2>
<p>When asking where do Seine river cruises depart, this summary table outlines the key embarkation ports, major operators, and transit connections across Paris:</p>

<table>
  <thead>
    <tr>
      <th>Pier Name</th>
      <th>Major Operators</th>
      <th>Bank & Landmark</th>
      <th>Nearest Metro / RER</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Port de la Bourdonnais</strong></td>
      <td>Bateaux Parisiens</td>
      <td>Left Bank, Eiffel Tower base</td>
      <td>Bir-Hakeim (M6) / Champ de Mars (RER C)</td>
    </tr>
    <tr>
      <td><strong>Port de la Conférence</strong></td>
      <td>Bateaux-Mouches</td>
      <td>Right Bank, Pont de l'Alma</td>
      <td>Alma-Marceau (M9) / Pont de l'Alma (RER C)</td>
    </tr>
    <tr>
      <td><strong>Pont Neuf (Vert-Galant)</strong></td>
      <td>Vedettes du Pont Neuf</td>
      <td>Île de la Cité, historic center</td>
      <td>Pont Neuf (M7) / Cité (M4)</td>
    </tr>
    <tr>
      <td><strong>Port de Suffren</strong></td>
      <td>Vedettes de Paris</td>
      <td>Left Bank, Eiffel Tower south</td>
      <td>Bir-Hakeim (M6) / Champ de Mars (RER C)</td>
    </tr>
    <tr>
      <td><strong>Port de Solférino</strong></td>
      <td>Paris Seine / La Marina</td>
      <td>Left Bank, Musée d'Orsay</td>
      <td>Solférino (M12) / Musée d'Orsay (RER C)</td>
    </tr>
  </tbody>
</table>

<h2>How to Identify Your Boarding Pier on Your Ticket</h2>
<p>A common mistake among first-time visitors is assuming all cruises departing near the Eiffel Tower leave from the same spot. When checking where do Seine river cruises depart on your confirmation voucher, verify these details:</p>
<ul>
  <li><strong>Check the Operator Name:</strong> Look for the operating company printed on your ticket (Bateaux Parisiens, Bateaux-Mouches, or Vedettes du Pont Neuf). Each operator departs exclusively from its own dock.</li>
  <li><strong>Note the Pontoon Number:</strong> Large piers have multiple pontoons. Sightseeing departures usually board at Ponton 3, while meal cruises board from separate hospitality docks.</li>
  <li><strong>Verify the Quayside Bank:</strong> Crossing a Seine bridge on foot during peak hours can take 10 to 15 minutes. Confirm whether you need the Left or Right Bank before setting out.</li>
</ul>

<h2>Essential Tips for Smooth Embarkation</h2>
<ul>
  <li><strong>Arrive 15 to 20 Minutes Early:</strong> Boarding gates close 5 to 10 minutes prior to departure. Electronic ticket scanning takes place before you step onto the pontoon.</li>
  <li><strong>Wear Walking Shoes:</strong> Paris quays sit below street level with historic stone paving. Wear comfortable shoes for descent via steps or ramps.</li>
  <li><strong>Keep Digital Barcodes Handy:</strong> Mobile tickets on smartphones are universally accepted. Save an offline screenshot before heading to river level.</li>
  <li><strong>What If You Arrive at the Wrong Pier?</strong> If you reach Port de la Conférence on the Right Bank with a Bateaux Parisiens ticket, cross Pont de l'Alma toward the Left Bank immediately (allow 15 minutes walking).</li>
</ul>

<h2>Frequently Asked Questions About Seine River Cruise Departure Points</h2>

<h3>Do all Seine river cruises leave from the Eiffel Tower?</h3>
<p>No. While popular operators such as Bateaux Parisiens depart directly beneath the Eiffel Tower on the Left Bank, other major cruise lines depart from Pont de l'Alma on the Right Bank or Pont Neuf at Île de la Cité.</p>

<h3>Which Metro station is closest to Port de la Bourdonnais?</h3>
<p>Bir-Hakeim on Metro Line 6 and Champ de Mars - Tour Eiffel on RER Line C are the closest stations, both within a 6 to 10 minute walk of the pier gates.</p>

<h3>Do Seine sightseeing cruises return to the same pier where they depart?</h3>
<p>Yes. All standard 60-minute to 70-minute sightseeing loop cruises return to their original embarkation dock. Hop-on hop-off water shuttles (such as Batobus) are the only river boats that allow disembarking at multiple piers.</p>`;

const postData = {
  slug: "where-do-seine-river-cruises-depart",
  title: "Where Do Seine River Cruises Depart? Complete Paris Pier & Boarding Guide",
  metaTitle: "Where Do Seine River Cruises Depart? Paris Pier & Boarding Guide",
  metaDescription: "Discover where Seine River cruises depart in Paris, including Port de la Bourdonnais, Pont de l'Alma, and Pont Neuf, with Metro stations and boarding tips.",
  category: "Departures & Piers",
  excerpt: "Discover exactly where Seine River cruises depart across Paris, from the foot of the Eiffel Tower at Port de la Bourdonnais to Pont de l'Alma, Pont Neuf, and dining docks.",
  quickAnswer: "Seine River cruises in Paris depart from several distinct commercial piers rather than a single terminal. The main departure points are Port de la Bourdonnais directly below the Eiffel Tower (Bateaux Parisiens), Port de la Conférence at Pont de l'Alma on the Right Bank (Bateaux-Mouches), and the western tip of Île de la Cité below Pont Neuf (Vedettes du Pont Neuf). Always check the specific operator and port printed on your ticket before heading to the quayside.",
  readTime: "6 min read",
  date: "2026-10-15",
  updatedAt: "2026-10-15T07:30:00Z",
  image: "https://vel8aqzfqfybmsb2.public.blob.vercel-storage.com/uploads/where-do-seine-river-cruises-depart-hero-t7phSmhFW5EOmk99V6ZIb3KGMv4R8J.jpg",
  imageAlt: "Seine River cruise boats docked at Port de la Bourdonnais beneath the illuminated Eiffel Tower at golden sunset in Paris",
  recommendedTourId: "seine-1-hour-sightseeing-cruise",
  recommendedTourAfterBlock: 1,
  content: articleContent,
  sortOrder: 0,
  noIndex: false,
  noFollow: false,
  canonicalUrl: "https://www.seinerivercruisetours.com/blog/where-do-seine-river-cruises-depart",
  ogTitle: "Where Do Seine River Cruises Depart? Complete Paris Pier & Boarding Guide",
  ogDescription: "Discover where Seine River cruises depart in Paris, including Port de la Bourdonnais, Pont de l'Alma, and Pont Neuf, with Metro stations and boarding tips.",
  ogImage: "https://vel8aqzfqfybmsb2.public.blob.vercel-storage.com/uploads/where-do-seine-river-cruises-depart-hero-t7phSmhFW5EOmk99V6ZIb3KGMv4R8J.jpg",
  focusKeyword: "where do seine river cruises depart",
  ctaHeading: "Ready to cruise the Seine River in Paris?",
  ctaBody: "Compare official 1-hour sightseeing cruises, evening illuminations tours, and Eiffel Tower combos on our homepage.",
  ctaButtonText: "Compare Seine River Cruise Tickets & Tours",
  ctaButtonHref: "/#tours",
};

async function seed() {
  console.log("Seeding article into Neon database (seine-river-cruise-tours)...");

  await sql`
    INSERT INTO posts (
      slug, title, meta_title, meta_description, category, excerpt,
      quick_answer, read_time, date, updated_at, image, image_alt,
      recommended_tour_id, recommended_tour_after_block, content, sort_order,
      no_index, no_follow, canonical_url, og_title, og_description, og_image,
      focus_keyword, cta_heading, cta_body, cta_button_text, cta_button_href
    ) VALUES (
      ${postData.slug}, ${postData.title}, ${postData.metaTitle}, ${postData.metaDescription},
      ${postData.category}, ${postData.excerpt}, ${postData.quickAnswer}, ${postData.readTime},
      ${postData.date}, ${postData.updatedAt}, ${postData.image}, ${postData.imageAlt},
      ${postData.recommendedTourId}, ${postData.recommendedTourAfterBlock},
      ${JSON.stringify(postData.content)}::jsonb, ${postData.sortOrder},
      ${postData.noIndex}, ${postData.noFollow}, ${postData.canonicalUrl},
      ${postData.ogTitle}, ${postData.ogDescription}, ${postData.ogImage},
      ${postData.focusKeyword}, ${postData.ctaHeading}, ${postData.ctaBody},
      ${postData.ctaButtonText}, ${postData.ctaButtonHref}
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      category = EXCLUDED.category,
      excerpt = EXCLUDED.excerpt,
      quick_answer = EXCLUDED.quick_answer,
      read_time = EXCLUDED.read_time,
      date = EXCLUDED.date,
      updated_at = EXCLUDED.updated_at,
      image = EXCLUDED.image,
      image_alt = EXCLUDED.image_alt,
      recommended_tour_id = EXCLUDED.recommended_tour_id,
      recommended_tour_after_block = EXCLUDED.recommended_tour_after_block,
      content = EXCLUDED.content,
      sort_order = EXCLUDED.sort_order,
      no_index = EXCLUDED.no_index,
      no_follow = EXCLUDED.no_follow,
      canonical_url = EXCLUDED.canonical_url,
      og_title = EXCLUDED.og_title,
      og_description = EXCLUDED.og_description,
      og_image = EXCLUDED.og_image,
      focus_keyword = EXCLUDED.focus_keyword,
      cta_heading = EXCLUDED.cta_heading,
      cta_body = EXCLUDED.cta_body,
      cta_button_text = EXCLUDED.cta_button_text,
      cta_button_href = EXCLUDED.cta_button_href;
  `;

  console.log("✓ Successfully seeded post into Neon database!");

  // Now sync data/posts.json with all posts from the DB so fallback matches
  const rows = await sql`SELECT * FROM posts ORDER BY date DESC, sort_order ASC;`;
  console.log(`Fetched ${rows.length} posts from DB to update data/posts.json...`);

  const jsonPosts = rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    category: r.category,
    excerpt: r.excerpt,
    quickAnswer: r.quick_answer,
    readTime: r.read_time,
    date: r.date,
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString().slice(0, 10) : r.date,
    image: r.image,
    imageAlt: r.image_alt,
    recommendedTourId: r.recommended_tour_id || "",
    recommendedTourAfterBlock: r.recommended_tour_after_block === null ? undefined : Number(r.recommended_tour_after_block),
    content: typeof r.content === "string" ? r.content : r.content,
    sortOrder: r.sort_order,
    ctaHeading: r.cta_heading,
    ctaBody: r.cta_body,
    ctaButtonText: r.cta_button_text,
    ctaButtonHref: r.cta_button_href,
    focusKeyword: r.focus_keyword,
    noIndex: !!r.no_index,
    noFollow: !!r.no_follow,
    canonicalUrl: r.canonical_url,
    ogTitle: r.og_title,
    ogDescription: r.og_description,
    ogImage: r.og_image,
  }));

  const postsJsonPath = path.resolve(process.cwd(), "data/posts.json");
  fs.writeFileSync(postsJsonPath, JSON.stringify(jsonPosts, null, 2), "utf8");
  console.log(`✓ Updated data/posts.json with all ${jsonPosts.length} posts!`);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
