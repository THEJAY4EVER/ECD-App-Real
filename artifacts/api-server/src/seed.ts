import { db, usersTable, lessonsTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// Curated list of well-known, embeddable kid-friendly YouTube videos.
// Updated on every startup so that retired/blocked IDs can be swapped in.
// Verified embeddable YouTube IDs — tested for mobile WebView compatibility.
// All from channels that allow embedding & have no age restrictions.
const LESSON_VIDEO_REFRESH: { titlePrefix: string; youtubeId: string }[] = [
  { titlePrefix: "Counting from 1 to 10", youtubeId: "DR-cfDsHCGA" },   // Pinkfong: 1-20 Number Song
  { titlePrefix: "Shapes All Around",     youtubeId: "OEbRDtCAFdU" },   // Bounce Patrol: Shapes
  { titlePrefix: "ABC Phonics",           youtubeId: "BELlZKpi1Zs" },   // A for Apple Phonics Song
  { titlePrefix: "Storytime",             youtubeId: "GwV7k6Y5HE0" },   // African Folk Tales for Kids
  { titlePrefix: "Mhuri Yangu",           youtubeId: "rsGfNYzkbcI" },   // Shona family song
  { titlePrefix: "Mazuva eVhiki",         youtubeId: "ZzfGAtKK4lA" },   // Shona days of week
  { titlePrefix: "Animals of Zimbabwe",   youtubeId: "Tvb0SUS7jSQ" },   // African wildlife for kids
  { titlePrefix: "How Plants Grow",       youtubeId: "tkFPyue5X3Q" },   // How plants grow for kids
  { titlePrefix: "Drumming",              youtubeId: "vN7Ce3PydlY" },   // African drumming
  { titlePrefix: "Drawing Animals",       youtubeId: "PsBp82BCvRk" },   // Draw animals step-by-step
  { titlePrefix: "Heritage",              youtubeId: "VgDi-8L7iE0" },   // Great Zimbabwe
];

async function refreshLessonVideos() {
  const all = await db.select().from(lessonsTable);
  for (const l of all) {
    const match = LESSON_VIDEO_REFRESH.find((m) => l.title.startsWith(m.titlePrefix));
    if (match && (l.youtubeId !== match.youtubeId || !l.thumbnailUrl?.includes(match.youtubeId))) {
      await db
        .update(lessonsTable)
        .set({
          youtubeId: match.youtubeId,
          thumbnailUrl: `https://img.youtube.com/vi/${match.youtubeId}/hqdefault.jpg`,
        })
        .where(eq(lessonsTable.id, l.id));
      console.log(`Seed: refreshed video for "${l.title}" → ${match.youtubeId}`);
    }
  }
}

async function ensureAdmin() {
  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.role, "admin"))
    .limit(1);
  if (existing) return;

  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@Masuka1";
  const hash = await bcrypt.hash(adminPassword, 10);
  await db.insert(usersTable).values({
    username: "admin",
    passwordHash: hash,
    fullName: "School Administrator",
    role: "admin",
    classLevel: null,
    avatarColor: "#1E293B",
  });
  console.log("Seed: admin account created (username: admin)");
}

async function seed() {
  await ensureAdmin();

  const existingLessons = await db
    .select({ id: lessonsTable.id })
    .from(lessonsTable)
    .limit(1);
  if (existingLessons.length > 0) {
    console.log("Seed: lessons already exist, skipping lesson seed.");
    await refreshLessonVideos().catch((e) => console.error("refreshLessonVideos failed:", e));
    return;
  }

  const lessonRows = [
    {
      title: "Counting from 1 to 10",
      subject: "Mathematics",
      classLevel: "ECD A",
      youtubeId: "0VLxWIHRD4E",
      durationMinutes: 4,
      description: "A cheerful counting song to help little learners count from 1 to 10.",
      thumbnailUrl: "https://img.youtube.com/vi/0VLxWIHRD4E/hqdefault.jpg",
      milestone: "Counts to 20",
      content: `## Let's Count! 🔢

Numbers help us know **how many** things there are. Let's practise counting from **1 to 10**!

| Number | English | Shona |
|--------|---------|-------|
| 1 | one | rimwe |
| 2 | two | piri |
| 3 | three | tatu |
| 4 | four | ina |
| 5 | five | shanu |
| 6 | six | tanhatu |
| 7 | seven | nomwe |
| 8 | eight | sere |
| 9 | nine | pfumbamwe |
| 10 | ten | gumi |

### Try it yourself!
Count these things at home:
- 🪨 Count the stones in your yard
- 🌿 Count the leaves on a small plant
- 🥄 Count the spoons in your kitchen

**Remember:** Touch each object as you count — one number for each thing!

### Fun Tip
Hold up your fingers as you count. You have exactly **10 fingers** — perfect for counting to 10!`,
    },
    {
      title: "Shapes All Around Us",
      subject: "Mathematics",
      classLevel: "ECD A",
      youtubeId: "OEbRDtCAFdU",
      durationMinutes: 5,
      description: "Learn circles, squares, triangles and rectangles with everyday objects.",
      thumbnailUrl: "https://img.youtube.com/vi/OEbRDtCAFdU/hqdefault.jpg",
      milestone: "Recognizes shapes & colors",
      content: `## Shapes Are Everywhere! 🔷

Look around you — shapes are hiding in everyday objects!

### The Four Main Shapes

**⭕ Circle**
A circle is perfectly round with **no corners** and **no straight sides**.
*Find them at home:* a plate, the sun, a wheel, a coin

**⬜ Square**
A square has **4 equal sides** and **4 corners**.
*Find them at home:* a window pane, a tile, a slice of bread

**▭ Rectangle**
A rectangle has **4 sides** — two long and two short — and **4 corners**.
*Find them at home:* a door, a book, a brick, a bed

**🔺 Triangle**
A triangle has **3 sides** and **3 corners**.
*Find them at home:* a slice of watermelon, a roof, a mountain peak

### Colours and Shapes Together
Shapes become even more fun when you add colour:
- Draw a **red circle** 🔴
- Draw a **blue square** 🔵
- Draw a **yellow triangle** 🟡
- Draw a **green rectangle** 🟩

### Shape Hunt!
Walk around your home and find one of each shape. Draw what you find and colour it!`,
    },
    {
      title: "ABC Phonics Song",
      subject: "English",
      classLevel: "ECD A",
      youtubeId: "BELlZKpi1Zs",
      durationMinutes: 3,
      description: "The alphabet with the sound each letter makes.",
      thumbnailUrl: "https://img.youtube.com/vi/BELlZKpi1Zs/hqdefault.jpg",
      milestone: "Speaks in full sentences (English)",
      content: `## The ABC Alphabet 🔤

There are **26 letters** in the English alphabet. Every letter makes a special sound — this is called **phonics**!

### Letters, Sounds, and Words

| Letter | Sound | Word |
|--------|-------|------|
| **A** | /a/ | **A**pple 🍎 |
| **B** | /b/ | **B**all ⚽ |
| **C** | /k/ | **C**at 🐱 |
| **D** | /d/ | **D**og 🐶 |
| **E** | /e/ | **E**gg 🥚 |
| **F** | /f/ | **F**ish 🐟 |
| **G** | /g/ | **G**oat 🐐 |
| **H** | /h/ | **H**en 🐔 |
| **I** | /i/ | **I**nsect 🐛 |
| **J** | /j/ | **J**ug 🫙 |
| **K** | /k/ | **K**ite 🪁 |
| **L** | /l/ | **L**ion 🦁 |
| **M** | /m/ | **M**ango 🥭 |

### And the rest…
**N** — Nest · **O** — Owl · **P** — Pot · **Q** — Queen · **R** — Rain
**S** — Sun 🌞 · **T** — Tree 🌳 · **U** — Umbrella ☂️ · **V** — Vegetable
**W** — Water 💧 · **X** — Xylophone · **Y** — Yam 🍠 · **Z** — Zebra 🦓

### Practise!
Say the sound of each letter out loud. Then find something at home that starts with:
- The letter **A**
- The letter **M**
- The letter **S**`,
    },
    {
      title: "Storytime: The Greedy Hyena",
      subject: "English",
      classLevel: "ECD B",
      youtubeId: "BgFZQzqIdYo",
      durationMinutes: 6,
      description: "An African folktale read aloud with colorful illustrations.",
      thumbnailUrl: "https://img.youtube.com/vi/BgFZQzqIdYo/hqdefault.jpg",
      milestone: "Speaks in full sentences (English)",
      content: `## About the Story 📖

*The Greedy Hyena* is a traditional African folktale. Stories like this have been told around fires for hundreds of years. They teach important lessons about how to live well.

### What the Story Is About
The hyena is clever but very **greedy** — it always wants more than its fair share. When the other animals share a feast, the hyena tries to take everything for itself. In the end, its greed causes it to lose everything.

### Important Words

| Word | Meaning |
|------|---------|
| **greedy** | wanting more than you need |
| **feast** | a big, special meal |
| **share** | to give some to others |
| **clever** | smart and quick-thinking |
| **selfish** | only thinking of yourself |

### The Lesson
> *"Those who are greedy often end up with nothing."*

This means: it is better to be happy with what you have and to share with others.

### Think About It
1. Why did the hyena get into trouble?
2. What would YOU do if your friend was hungry?
3. Have you ever shared something? How did it feel?

### Activity
Draw the hyena and write one sentence about what happened at the end of the story.`,
    },
    {
      title: "Mhuri Yangu — Singing About My Family",
      subject: "Shona",
      classLevel: "ECD A",
      youtubeId: "rsGfNYzkbcI",
      durationMinutes: 4,
      description: "Learn the Shona words for family members through song.",
      thumbnailUrl: "https://img.youtube.com/vi/rsGfNYzkbcI/hqdefault.jpg",
      milestone: "Speaks in full sentences (Shona)",
      content: `## Mhuri Yangu — My Family 👨‍👩‍👧‍👦

In Shona, the word **mhuri** (say: mhoo-ree) means **family**. Our family is very special — they love us and take care of us!

### Family Words in Shona

| English | Shona | How to say it |
|---------|-------|---------------|
| Mother | **Amai** | Ah-mai |
| Father | **Baba** | Bah-bah |
| Child | **Mwana** | Mwah-nah |
| Grandmother | **Ambuya** | Ahm-boo-yah |
| Grandfather | **Sekuru** | Say-koo-roo |
| Older brother | **Mukoma** | Moo-ko-mah |
| Younger sibling | **Munun'una** | Moo-noo-noo-nah |
| Sister | **Hanzvadzi** | Hahn-zvah-dzee |
| Aunt | **Tete** | Teh-teh |

### Simple Sentences in Shona
- *Ndinoda amai vangu.* — I love my mother.
- *Baba vangu vanoshanda.* — My father works hard.
- *Ambuya vanondida.* — My grandmother loves me.
- *Ndinoda mhuri yangu yose.* — I love my whole family.

### Activity 🎨
Draw your family. Under each person, write their Shona name (Amai, Baba, Mukoma, etc.)`,
    },
    {
      title: "Mazuva eVhiki — Days of the Week in Shona",
      subject: "Shona",
      classLevel: "ECD B",
      youtubeId: "ZzfGAtKK4lA",
      durationMinutes: 3,
      description: "Sing along and learn the seven days of the week in Shona.",
      thumbnailUrl: "https://img.youtube.com/vi/ZzfGAtKK4lA/hqdefault.jpg",
      milestone: "Speaks in full sentences (Shona)",
      content: `## Mazuva eVhiki — Days of the Week 📅

There are **7 days** in one week. In Shona we say **mazuva manomwe** (mah-zoo-vah mah-nom-way) — "seven days."

### The Seven Days

| # | Shona | English | How to say it |
|---|-------|---------|---------------|
| 1 | **Muvhuro** | Monday | Moo-vhoo-ro |
| 2 | **Chipiri** | Tuesday | Chee-pee-ree |
| 3 | **Chitatu** | Wednesday | Chee-tah-too |
| 4 | **China** | Thursday | Chee-nah |
| 5 | **Chishanu** | Friday | Chee-shah-noo |
| 6 | **Mugovera** | Saturday | Moo-go-veh-rah |
| 7 | **Svondo** | Sunday | Svon-do |

### Helpful Sentences
- *Nhasi ndeMuvhuro.* — Today is Monday.
- *Mangwana ndoChipiri.* — Tomorrow is Tuesday.
- *Nezuro ndakaenda kuchikoro.* — Yesterday I went to school.

### Did You Know?
The days **Chipiri, Chitatu, China, Chishanu** mean "second, third, fourth, fifth" — they are counting the days of the week!

### Activity ✏️
What day is today? Write it in Shona and English. Then list two things you do on **Mugovera** (Saturday).`,
    },
    {
      title: "Animals of Zimbabwe",
      subject: "Environmental Science",
      classLevel: "ECD A",
      youtubeId: "2cZzP-pj-d0",
      durationMinutes: 5,
      description: "Meet elephants, giraffes, lions and other animals of our home.",
      thumbnailUrl: "https://img.youtube.com/vi/2cZzP-pj-d0/hqdefault.jpg",
      milestone: null,
      content: `## Animals of Zimbabwe 🦁

Zimbabwe is home to some of the most amazing wild animals in the world! We must love and protect them.

### Big Animals (Mhuka Huru)

**🐘 Elephant — Nzou**
The elephant is the biggest land animal. It uses its long trunk to drink water, pick up food, and say hello to friends. Hwange National Park has thousands of elephants!

**🦒 Giraffe — Twiza**
The giraffe is the tallest animal in the world. Its long neck lets it eat leaves from the very tops of tall acacia trees.

**🦁 Lion — Shumba**
The lion is called the King of the Animals. It has a loud ROAR that can be heard 8 kilometres away! Lions live in family groups called *prides*.

**🦏 Rhinoceros — Chipembere**
The rhino has a big horn on its nose. We must protect rhinos — they are in danger of disappearing forever.

**🐊 Crocodile — Garwe**
The crocodile lives in rivers and lakes like Lake Kariba. It has very sharp teeth and is very fast in the water.

**🦓 Zebra — Mbizi**
The zebra has black and white stripes. Each zebra's stripes are unique — like your fingerprints!

### How We Protect Animals
- Never drop litter near rivers or game parks
- Do not throw things at wild animals
- Tell an adult if you see an injured animal

### Activity 🎨
Draw your favourite Zimbabwe animal. Write its name in English and in Shona.`,
    },
    {
      title: "How Plants Grow",
      subject: "Environmental Science",
      classLevel: "ECD B",
      youtubeId: "tkFPyue5X3Q",
      durationMinutes: 4,
      description: "From seed to baobab — discover how plants grow from a tiny seed.",
      thumbnailUrl: "https://img.youtube.com/vi/tkFPyue5X3Q/hqdefault.jpg",
      milestone: null,
      content: `## How Plants Grow 🌱

Every plant — even a tall baobab tree — starts as a tiny **seed**. With water, soil, and sunlight, it grows into something amazing!

### The Stages of Plant Growth

**1. The Seed 🌰**
A seed contains a tiny sleeping plant. It needs water to wake up and start growing. This waking-up is called **germination**.

**2. The Seedling 🌿**
After a few days, a small green shoot pushes up through the soil. This is the baby plant!

**3. The Young Plant**
The seedling grows taller. Its **leaves** use sunlight to make food. This is called **photosynthesis**.

**4. The Mature Plant 🌳**
The full-grown plant may grow flowers, fruits, and new seeds — starting the cycle again!

### What Plants Need

| Need | Why it matters |
|------|---------------|
| 💧 **Water** | Carries food and minerals around the plant |
| ☀️ **Sunlight** | Makes food through photosynthesis |
| 🌍 **Soil** | Holds the plant up and gives it minerals |
| 💨 **Air** | The plant breathes and uses carbon dioxide |

### The Amazing Baobab Tree (Mbuyu) 🌳
The baobab is one of Zimbabwe's most special trees. It can live for **thousands of years**! Its enormous trunk stores water so the tree can survive dry seasons. Animals, birds, and people all eat the baobab's fruit.

### Activity 🌱
Plant a bean seed in a cup of soil. Water it every day and draw what you see each day for two weeks. Watch the seed become a plant!`,
    },
    {
      title: "Drumming with Mbira Beats",
      subject: "Visual & Performing Arts",
      classLevel: "ECD A",
      youtubeId: "vN7Ce3PydlY",
      durationMinutes: 6,
      description: "Clap and stomp along to traditional Zimbabwean rhythms.",
      thumbnailUrl: "https://img.youtube.com/vi/vN7Ce3PydlY/hqdefault.jpg",
      milestone: "Sings & dances to rhythm",
      content: `## Music from Zimbabwe 🎵

Zimbabwe has a rich tradition of music and dance. Two of the most important instruments are the **mbira** and the **ngoma** (drum).

### The Mbira — Zimbabwe's Thumb Piano
The mbira (say: mm-bee-rah) is made from small metal keys fixed onto a wooden board. You pluck the keys with your thumbs to make a beautiful, buzzing sound.

The mbira is used in **bira** ceremonies — special community gatherings where people sing, dance, and give thanks to their ancestors. It is one of the most important symbols of Zimbabwe's culture.

### The Ngoma — The Traditional Drum 🥁
The ngoma is a drum made from hollowed wood with animal skin stretched tightly over one end. Drummers beat it with their hands to create powerful rhythms.

Drums were used to:
- Call people together for meetings
- Celebrate harvests and weddings
- Send messages between villages

### What is a Rhythm?
A **rhythm** is a pattern of beats that repeats. Try this 3-beat rhythm by clapping:

**LOUD – soft – soft – LOUD – soft – soft**

That's 1-2-3, 1-2-3 — just like many traditional songs!

### Activity 👏
1. Clap a simple rhythm with your hands (like 1-2, 1-2)
2. Ask a friend or family member to clap the same rhythm back
3. Try drumming on a table or a tin with your fingers

### Did You Know?
The mbira is so famous that musicians from around the world travel to Zimbabwe to learn how to play it!`,
    },
    {
      title: "Drawing Animals — Easy Steps",
      subject: "Visual & Performing Arts",
      classLevel: "ECD B",
      youtubeId: "PsBp82BCvRk",
      durationMinutes: 7,
      description: "A step-by-step lesson on drawing your favorite animal.",
      thumbnailUrl: "https://img.youtube.com/vi/PsBp82BCvRk/hqdefault.jpg",
      milestone: "Draws recognizable figures",
      content: `## The Art of Drawing 🎨

Drawing is a wonderful way to show what you see and feel. Every great artist started with simple shapes — just like you!

### The Secret: All Animals Are Made of Shapes!

Most animals can be drawn by combining:
- **Circles and ovals** → head, body, eyes
- **Lines and rectangles** → legs, tail, neck
- **Triangles** → ears, beak, claws

### Draw a Lion Step by Step 🦁

1. Draw a **big oval** for the body
2. Draw a **smaller circle** at the top for the head
3. Draw a **wavy circle** around the head for the mane
4. Add **4 short rectangles** below the body for legs
5. Draw **2 small circles** for eyes with dots inside
6. Draw a **small triangle** for the nose
7. Add a **long curved line** with a puff at the end for the tail

### Colouring Tips
- Use **yellow and orange** for the lion's body
- Use **dark brown** for the mane
- Draw **green grass** around the lion

### More Animals to Try

| Animal | Shona name |
|--------|-----------|
| 🐘 Elephant | Nzou |
| 🦒 Giraffe | Twiza |
| 🐢 Tortoise | Kamba |
| 🐓 Rooster | Jongwe |
| 🐟 Fish | Hove |

### Remember
- There is no "wrong" drawing — every drawing is yours!
- Look carefully at the animal before you draw it
- Practise a little bit every day and you will improve!`,
    },
    {
      title: "Heritage: Great Zimbabwe",
      subject: "Heritage Studies",
      classLevel: "ECD B",
      youtubeId: "VgDi-8L7iE0",
      durationMinutes: 5,
      description: "A gentle introduction to the ancient stone city of Great Zimbabwe.",
      thumbnailUrl: "https://img.youtube.com/vi/VgDi-8L7iE0/hqdefault.jpg",
      milestone: null,
      content: `## Great Zimbabwe — Our Ancient City 🏛️

**Great Zimbabwe** is one of the most incredible places in all of Africa. It is a city built entirely from **stone** — with no cement or glue to hold the rocks together!

### Key Facts

| Fact | Detail |
|------|--------|
| 📍 **Location** | Masvingo Province, Zimbabwe |
| 👷 **Built by** | The Shona people (our ancestors) |
| 📅 **When** | About 800 to 900 years ago |
| 🪨 **Built from** | Granite stones (no mortar used!) |
| 📐 **Size** | Over 700 hectares |
| 🌍 **UNESCO status** | World Heritage Site |

### Why Was Great Zimbabwe So Important?
Great Zimbabwe was the **capital of a powerful kingdom**. The king and his family lived inside the tall stone walls. The city was also a centre for **trade** — people exchanged gold, cattle, and ivory with traders from as far away as China and Arabia!

### What Does "Zimbabwe" Mean?
The name **Zimbabwe** comes from the Shona phrase:

> ***dzimba dza mabwe*** (DZIM-bah dzah mah-BWAY)
> meaning **"Houses of Stone"**

Our whole country is named after this incredible place!

### Why We Should Be Proud
Great Zimbabwe proves that African people were **great builders, leaders, and traders**. We must protect and celebrate this heritage.

### Activity ✏️
1. Draw the tall stone walls of Great Zimbabwe
2. Write TWO facts you learned today underneath your drawing
3. Ask a family member if they have ever visited Great Zimbabwe`,
    },
  ];

  await db.insert(lessonsTable).values(lessonRows);

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
