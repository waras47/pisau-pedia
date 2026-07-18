import { type BlogCategory, type BlogPost } from "./blog.types";

// Categories mirror the "Guides" sub-menu under Learn in the main nav
// (entities/navigation/model/navigation.data.ts) — slugs must match.
export const categories: BlogCategory[] = [
  {
    slug: "knife-types",
    name: "Knife Types",
    description:
      "A guide to the traditional Japanese blade shapes — what each one is built for, and how to tell them apart.",
  },
  {
    slug: "sharpening-guide",
    name: "Sharpening Guide",
    description:
      "Whetstone grits, bevel angles, and technique — everything for keeping an edge that actually cuts.",
  },
  {
    slug: "steel-care",
    name: "Steel & Care",
    description:
      "Carbon vs. stainless, patina, rust prevention, and the small habits that keep a blade in good shape for decades.",
  },
];

export const posts: BlogPost[] = [
  {
    slug: "gyuto-santoku-bunka-which-first",
    title: "Gyuto, Santoku, or Bunka? Choosing Your First Japanese Chef's Knife",
    excerpt:
      "The three most common multi-purpose Japanese knives look similar at a glance but handle very differently. Here's how to tell them apart.",
    categorySlug: "knife-types",
    readingMinutes: 6,
    publishedAt: "2026-05-12",
    content: [
      "If you're buying your first Japanese chef's knife, you'll almost certainly end up choosing between a Gyuto, a Santoku, or a Bunka. All three are marketed as \"multi-purpose\" knives, and all three can genuinely handle most kitchen tasks — but the blade geometry behind each one leads to a noticeably different feel in hand.",
      "The Gyuto is the closest in shape to a Western chef's knife: a long, gently curved blade that tapers to a fine point, typically 210mm to 270mm. That curve is what lets you rock the knife through a rolling cutting motion — the same technique most home cooks already know from a Western knife. If you're coming from a standard chef's knife and want something that feels familiar but sharper and lighter, the Gyuto is the safest starting point.",
      "The Santoku trades length and curve for a flatter edge and a more rounded, less pointed tip. \"Santoku\" roughly translates to \"three virtues,\" referring to its balance across meat, fish, and vegetables. Because the edge is flatter, it favors an up-and-down chopping motion rather than a rocking one — some cooks find this more natural, especially on a cutting board that doesn't have much room for a rocking stroke.",
      "The Bunka looks like a Santoku at first glance but has a distinctive angled, reverse-tanto tip — a straight facet cutting back to the point instead of a smooth curve. That reinforced tip point makes the Bunka noticeably better at detail work: trimming, scoring, and other tasks where you're using just the tip of the blade rather than the whole edge.",
      "In practice, the difference between a Santoku and a Bunka matters less than the difference between either of those and a Gyuto. If your cutting technique already relies on rocking the blade, a Gyuto will feel more natural immediately. If you tend to lift the knife off the board between cuts, a Santoku or Bunka will likely feel just as comfortable, with the Bunka's tip giving you a bit more precision for finer work.",
      "None of these shapes is objectively \"better\" — they're suited to different techniques, and most serious home cooks eventually own more than one. If you're only buying one knife, though, think about how you actually cut before you think about the blade's country of origin or steel type.",
    ],
  },
  {
    slug: "nakiri-vs-usuba",
    title: "Nakiri vs. Usuba: Understanding Japanese Vegetable Knives",
    excerpt:
      "Both are built specifically for vegetables, but one is a double-bevel knife anyone can pick up, and the other takes real practice.",
    categorySlug: "knife-types",
    readingMinutes: 5,
    publishedAt: "2026-05-28",
    content: [
      "Most Japanese knife shapes are multi-purpose by design, but vegetable prep gets a category of its own: the rectangular, flat-edged blades built specifically for clean, straight cuts through produce. The two you'll come across are the Nakiri and the Usuba, and while they look similar, they're built for very different skill levels.",
      "The Nakiri is double-beveled — sharpened symmetrically on both sides, like almost every Western knife you've used. That makes it approachable: you can use it the same way you'd use any other kitchen knife, no adjustment in technique required. The flat edge and rectangular profile are what make it excel at vegetables specifically — a straight push cut all the way through, rather than the rocking motion a curved blade encourages, which keeps slices even and prevents the accordion effect you sometimes get with a curved edge on soft produce.",
      "The Usuba is the traditional, professional counterpart — single-beveled, sharpened on one side only with the other side left flat. A single bevel lets the edge get thinner and sharper than a comparable double-bevel blade can, and it's part of why professional Japanese chefs favor it for fine work like katsuramuki, the technique of peeling a continuous, paper-thin ribbon from a whole daikon radish.",
      "That single bevel is also why the Usuba isn't a knife you casually pick up. It cuts with a slight lateral drift unless your technique compensates for it, and sharpening a single-bevel edge correctly takes real practice — you're maintaining one flat face and one beveled face, not two symmetric bevels. Most home cooks who buy an Usuba without prior single-bevel experience end up frustrated with results a Nakiri would have given them more easily.",
      "For nearly all home kitchens, the Nakiri is the better choice — it delivers the flat-edge, straight-cut advantage for vegetable prep without demanding a change in how you already hold and use a knife. The Usuba is worth considering only if you're already comfortable with single-bevel sharpening, or specifically want to learn it.",
    ],
  },
  {
    slug: "whetstone-grits-explained",
    title: "Whetstone Grits Explained: From Repair to Polish",
    excerpt:
      "Grit numbers on a whetstone box aren't just \"coarse to fine\" — each range does a specific job, and using the wrong one wastes steel.",
    categorySlug: "sharpening-guide",
    readingMinutes: 7,
    publishedAt: "2026-06-03",
    content: [
      "Every whetstone is labeled with a grit number, and it's tempting to think of that number as a simple coarse-to-fine scale where higher is always \"better.\" In practice, each grit range does a specific job, and skipping straight to a high grit on a knife that needs real repair just wastes time polishing an edge that was never properly reshaped underneath.",
      "Grits from roughly 220 to 600 are repair stones — coarse enough to remove real steel quickly. You'd reach for one of these if a blade has a chip, a badly rolled edge, or has gone so long between sharpenings that the bevel needs to be reshaped from scratch. This stage isn't about sharpness; it's about correcting geometry so the following stages have something even to work with.",
      "The 1000 to 3000 range is where most routine sharpening happens. If your knife is already in reasonable shape and has just lost its edge through normal use, this is where you'll spend most of your time — refining the bevel and raising a consistent burr along the entire edge before moving on.",
      "From 3000 upward, you're polishing rather than sharpening. Stones in the 3000–8000 range refine the edge left by the previous stage, remove the microscopic scratches from coarser grits, and bring the bevel to a finer, more reflective finish. Beyond 8000, you're firmly in the territory of mirror polishing — it looks impressive and does slightly reduce friction through food, but it contributes very little to actual cutting performance once you're past around 6000.",
      "A practical three-stone setup covers nearly everything: a 400–600 stone for occasional repair work, a 1000–2000 stone for regular maintenance sharpening, and something in the 3000–6000 range if you want a noticeably cleaner finish. You don't need every grit in between — you need the right one for the condition the edge is actually in.",
      "One habit worth building regardless of grit: always flatten your stone before use, especially the stones you sharpen with most often. A stone that's worn into a slight dip won't hold a consistent angle across the length of the blade, and no amount of technique fixes an edge sharpened against an uneven surface.",
    ],
  },
  {
    slug: "finding-the-right-sharpening-angle",
    title: "Finding the Right Sharpening Angle for Your Knife",
    excerpt:
      "Japanese and Western knives are typically ground to different bevel angles — matching your technique to the knife matters more than any single \"correct\" number.",
    categorySlug: "sharpening-guide",
    readingMinutes: 6,
    publishedAt: "2026-06-14",
    content: [
      "Bevel angle is one of the most-argued numbers in knife sharpening, and part of the confusion is that there genuinely isn't one correct answer — it depends on what the knife was ground to in the first place. Get the angle wrong relative to the existing bevel and you'll either fail to reach the actual edge, or you'll grind away far more steel than necessary reshaping it to a new angle.",
      "Traditional Japanese knives are typically ground to a narrower angle than their Western counterparts — often somewhere around 12 to 15 degrees per side. That narrower angle is part of why Japanese blades can take a noticeably sharper, finer edge: less steel behind the cutting edge means less resistance moving through food. The trade-off is that a thinner edge is also more prone to chipping if it meets something hard, like bone, or is used carelessly on a glass or stone surface.",
      "Western knives are usually ground wider, in the 17 to 20 degree range per side. That extra steel behind the edge makes it more durable and more forgiving of rougher use, at some cost to how fine an edge it can ultimately hold. Neither angle is objectively better — they represent different trade-offs between sharpness and durability, and the right one depends on how the knife is actually used.",
      "The practical takeaway: before sharpening any knife, take a moment to look at the existing bevel rather than assuming a number. Hold the blade up and look at the reflective bevel face against the light — you can usually see roughly how wide it already is. Match that angle as closely as you can rather than picking a fresh number, unless you deliberately intend to reprofile the edge.",
      "Consistency matters more than precision to the degree. A stable 15-degree angle held evenly along the whole edge will out-cut a technically \"correct\" angle that wanders up and down the blade. If you're sharpening freehand and struggling with consistency, an angle guide clipped to the spine of the blade is a reasonable crutch while you build the muscle memory — there's no prize for doing it without one.",
    ],
  },
  {
    slug: "carbon-steel-vs-stainless",
    title: "Carbon Steel vs. Stainless: What's the Real Difference?",
    excerpt:
      "It's not just about rust. Carbon and stainless steels behave differently at the edge, and that changes how a knife feels in daily use.",
    categorySlug: "steel-care",
    readingMinutes: 6,
    publishedAt: "2026-06-20",
    content: [
      "The carbon-versus-stainless question usually gets reduced to a single point: carbon steel rusts if you're not careful, stainless doesn't. That's true, but it's also the least interesting part of the comparison — the more relevant difference for daily cooking is how each type of steel behaves at the edge, not just how it behaves in the sink.",
      "Carbon steel is generally easier to sharpen and takes a noticeably finer edge than most stainless alloys. The grain structure allows it to be honed to a thinner, more acute bevel that holds up well, and touch-ups on a whetstone go faster because the steel is softer to work. That's a large part of why carbon steel remains the preferred choice among professional Japanese chefs who resharpen frequently and value edge quality over low maintenance.",
      "Stainless steel trades some of that edge refinement for practicality. Modern stainless alloys — especially the higher-end ones used in better kitchen knives — hold a working edge for longer between sharpenings and tolerate the kind of casual treatment a carbon blade won't forgive: a few hours sitting wet in a sink, contact with acidic ingredients, or just less attentive drying. For a knife that needs to survive a busy household rather than a single dedicated cook, that durability matters more than a marginal gain in sharpness.",
      "The rust question is real but manageable. Carbon steel forms a surface oxide layer, called a patina, through normal use — this is different from rust and is discussed in more detail elsewhere on this blog. Left wet for extended periods or stored without drying, though, carbon steel will develop actual rust, which stainless steel's chromium content largely prevents.",
      "Neither steel type is the \"correct\" choice — it's a genuine trade-off between edge performance and low-maintenance durability. If you're willing to hand-wash and dry a knife immediately after each use and enjoy the process of sharpening, carbon steel rewards that attention with a better edge. If you want a knife that performs reliably with less thought, a good stainless alloy is the more practical choice.",
    ],
  },
  {
    slug: "why-carbon-steel-develops-patina",
    title: "Why Your Carbon Steel Knife Develops a Patina (and Why That's a Good Thing)",
    excerpt:
      "That grey-blue tint spreading across a new carbon steel blade isn't damage — it's a protective layer, and encouraging it early pays off later.",
    categorySlug: "steel-care",
    readingMinutes: 5,
    publishedAt: "2026-06-29",
    content: [
      "New carbon steel comes out of the box bright and silver, and within the first few weeks of use it starts to change — a grey, blue, or brownish tint spreading unevenly across the blade face. The first instinct is to assume something's gone wrong. In fact, this is patina, a naturally forming oxide layer, and it's one of the more useful things about carbon steel rather than a flaw in it.",
      "Patina forms when the iron in carbon steel reacts with acids, oils, and moisture from the food you cut. Unlike rust, which is a destructive, flaking form of oxidation, patina is a stable, adherent layer that actually protects the steel underneath it from further, more aggressive oxidation. A well-developed patina is functionally a knife's own built-in rust resistance — it's why older, well-used carbon steel knives often handle moisture better than a knife straight out of the box.",
      "You can let patina form naturally through ordinary use, which produces an uneven, mottled pattern as different foods react with the steel at different rates. Onions, citrus, and other acidic ingredients tend to darken the steel faster than something like plain potatoes. Some owners prefer this organic look; others prefer to force an even patina deliberately, using a vinegar soak or a rubbed-on coating of mustard or coffee grounds, which reacts with the steel far faster and more uniformly than daily cooking will on its own.",
      "The forced route is worth considering on a brand-new knife specifically because an even patina from day one gives more consistent protection than the patchy version that builds up gradually. Whichever way it forms, patina is not a substitute for basic care — the blade still needs to be washed and thoroughly dried after each use. Patina slows oxidation; it doesn't stop it entirely, and a carbon blade left wet will still rust regardless of how developed its patina is.",
      "If you do see genuine rust rather than patina — a rough, reddish-orange, flaking spot rather than a smooth grey-blue tint — it can usually be worked out with a fine abrasive like a rust eraser or very fine sandpaper, followed by a fresh patina application over the cleaned area. Left untreated, rust will continue to spread and pit the steel, so it's worth addressing early rather than waiting.",
    ],
  },
];

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return posts.filter((p) => p.categorySlug === categorySlug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return posts.filter((p) => p.categorySlug === post.categorySlug && p.slug !== post.slug).slice(0, limit);
}
