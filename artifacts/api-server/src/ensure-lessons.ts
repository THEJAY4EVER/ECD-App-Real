import { db, lessonsTable } from "@workspace/db";
import { inArray } from "drizzle-orm";

// Extra lessons injected on startup when their title is not yet in the DB.
// YouTube IDs are also listed in seed.ts LESSON_VIDEO_REFRESH so they get
// patched automatically whenever a better ID is available.
const EXTRA_LESSONS = [
  // ── MATHEMATICS ──────────────────────────────────────────────────────
  {
    title: "Counting 11 to 20",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "_MVzXKfr6e8", durationMinutes: 4,
    description: "Keep counting! Learn the numbers from 11 all the way to 20.",
    thumbnailUrl: "https://img.youtube.com/vi/_MVzXKfr6e8/hqdefault.jpg",
    milestone: "Counts to 20",
    content: `## Keep Counting! 🔢

You already know 1–10. Now let's go further — all the way to **20**!

| Number | English | Shona |
|--------|---------|-------|
| 11 | eleven | gumi nerimwe |
| 12 | twelve | gumi nepiri |
| 13 | thirteen | gumi netatu |
| 14 | fourteen | gumi neina |
| 15 | fifteen | gumi neshanu |
| 16 | sixteen | gumi netanhatu |
| 17 | seventeen | gumi nenomwe |
| 18 | eighteen | gumi nesere |
| 19 | nineteen | gumi nepfumbamwe |
| 20 | twenty | makumi maviri |

### Tips
- After 10, just say "ten + one = eleven", "ten + two = twelve"…
- Clap your hands once for every number you say!

### Activity ✏️
Draw 11 stars ⭐, then 15 dots, then 20 circles. Count each group out loud.`,
  },
  {
    title: "Fun with Addition",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "uONIJ5TQ2DA", durationMinutes: 4,
    description: "Learn how to add two groups of objects together.",
    thumbnailUrl: "https://img.youtube.com/vi/uONIJ5TQ2DA/hqdefault.jpg",
    milestone: "Adds within 10",
    content: `## Adding Things Together ➕

**Addition** means putting two groups together to find out how many there are in total.

The **+** sign means "add" or "plus". The **=** sign means "equals" or "makes".

### Examples
- 🍎🍎 + 🍎 = 🍎🍎🍎 → **2 + 1 = 3**
- ⭐⭐⭐ + ⭐⭐ = ⭐⭐⭐⭐⭐ → **3 + 2 = 5**
- 🐥🐥🐥🐥 + 🐥🐥🐥 = ? → **4 + 3 = 7**

### Addition Table (up to 5)
| | +1 | +2 | +3 |
|--|--|--|--|
| 1 | 2 | 3 | 4 |
| 2 | 3 | 4 | 5 |
| 3 | 4 | 5 | 6 |

### Activity 🫘
Put 3 pebbles in your left hand and 4 in your right hand. Pour them together and count. What do you get?`,
  },
  {
    title: "Subtraction for Little Learners",
    subject: "Mathematics", classLevel: "ECD B",
    youtubeId: "pwQKugrFmJQ", durationMinutes: 4,
    description: "Find out what is left when you take some away.",
    thumbnailUrl: "https://img.youtube.com/vi/pwQKugrFmJQ/hqdefault.jpg",
    milestone: "Subtracts within 10",
    content: `## Taking Away — Subtraction ➖

**Subtraction** means taking some away from a group to see how many are left.

The **−** sign means "minus" or "take away".

### Examples
- 🐔🐔🐔🐔🐔 take away 🐔🐔 = 🐔🐔🐔 → **5 − 2 = 3**
- 8 mangoes, eat 3 → **8 − 3 = 5** mangoes left
- 10 − 4 = **6**

### How to solve
1. Start with the bigger number
2. Count *back* the smaller number on your fingers
3. Where you land is the answer!

### Activity ✏️
Draw 7 bananas 🍌. Cross out 3. How many are left?`,
  },
  {
    title: "Big and Small — Comparing Size",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "jXm74Me7E6g", durationMinutes: 3,
    description: "Compare objects — which is bigger? Which is smaller? Which is taller?",
    thumbnailUrl: "https://img.youtube.com/vi/jXm74Me7E6g/hqdefault.jpg",
    milestone: null,
    content: `## Big, Small, Tall and Short 📏

We can compare objects by their **size**. Here are the words we use:

| Comparing | Words |
|-----------|-------|
| Size | **big / small** |
| Height | **tall / short** |
| Length | **long / short** |
| Width | **wide / narrow** |
| Weight | **heavy / light** |

### Look around you!
- The door is **tall**. The stool is **short**.
- An elephant is **big**. A mouse is **small**.
- A river is **long**. A puddle is **short**.
- A rock is **heavy**. A feather is **light**.

### Activity 🔍
Find two things in your home. Which is bigger? Which is smaller? Draw both and label them.`,
  },
  {
    title: "Ordinal Numbers — First, Second, Third",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "jOUdGf8oVc8", durationMinutes: 3,
    description: "Learn ordinal numbers to describe position in a line or race.",
    thumbnailUrl: "https://img.youtube.com/vi/jOUdGf8oVc8/hqdefault.jpg",
    milestone: null,
    content: `## Ordinal Numbers 🏁

Ordinal numbers tell us the **position** of something — not how many there are, but **where** something is in a line or order.

| Number | Ordinal | Short form |
|--------|---------|-----------|
| 1 | **first** | 1st |
| 2 | **second** | 2nd |
| 3 | **third** | 3rd |
| 4 | **fourth** | 4th |
| 5 | **fifth** | 5th |
| 6 | **sixth** | 6th |
| 7 | **seventh** | 7th |

### In a race 🏃
Tendai came **1st**. Rudo came **2nd**. Simba came **3rd**.

### Activity ✏️
Line up 5 of your toys. Point to the 1st, the 3rd, and the 5th toy. Which one is last?`,
  },
  {
    title: "Heavy or Light — Measuring Weight",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "qUOQrXmfwDM", durationMinutes: 4,
    description: "Learn to compare and measure weight using everyday objects.",
    thumbnailUrl: "https://img.youtube.com/vi/qUOQrXmfwDM/hqdefault.jpg",
    milestone: null,
    content: `## Heavy and Light ⚖️

**Weight** tells us how heavy or light something is. We can compare weights by holding objects in our hands.

### Comparing Weight
- A **brick** is **heavier** than a **leaf**
- A **bag of mealie-meal** is **heavier** than a **mango**
- A **feather** is **lighter** than a **stone**

### Words to use
- heavy / light
- heavier than / lighter than
- heaviest / lightest

### Did you know?
We use a **scale** to measure weight. The object that pushes down more is heavier!

### Activity ⚖️
Hold a book in one hand and a pencil in the other. Which hand feels heavier? Which object is lighter?`,
  },
  {
    title: "3D Shapes — Cubes, Spheres and Cylinders",
    subject: "Mathematics", classLevel: "ECD B",
    youtubeId: "ZnZYK83utu0", durationMinutes: 5,
    description: "Go beyond flat shapes and explore solid 3D shapes we see every day.",
    thumbnailUrl: "https://img.youtube.com/vi/ZnZYK83utu0/hqdefault.jpg",
    milestone: "Recognizes shapes & colors",
    content: `## 3D Shapes — Solid Shapes! 🧊

Flat shapes like circles and squares are **2D**. But most things in real life are **3D** — they have length, width AND height!

| 3D Shape | Faces | Real life example |
|----------|-------|-------------------|
| 🎲 **Cube** | 6 flat square faces | dice, box |
| 🌐 **Sphere** | 0 — perfectly round | ball, orange |
| 🥫 **Cylinder** | 2 circles + 1 curved face | tin can, cup |
| 🍦 **Cone** | 1 circle + 1 point | ice cream cone, traffic cone |
| 📦 **Cuboid** | 6 rectangular faces | brick, book |
| 🔺 **Pyramid** | 4 triangles + 1 square base | Egyptian pyramids |

### Activity 🏠
Walk around your home. Find one object for each shape — a sphere, a cube, and a cylinder.`,
  },
  {
    title: "Patterns All Around Us",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "ZSjHZSbWfzw", durationMinutes: 3,
    description: "Discover repeating patterns in nature, fabric and everyday life.",
    thumbnailUrl: "https://img.youtube.com/vi/ZSjHZSbWfzw/hqdefault.jpg",
    milestone: null,
    content: `## Patterns Are Everywhere! 🌈

A **pattern** is something that repeats in the same order over and over.

### Types of Patterns

**AB pattern** (two things repeating):
🔴🔵🔴🔵🔴🔵 — red, blue, red, blue…

**ABC pattern** (three things):
⭐🌙☀️⭐🌙☀️ — star, moon, sun, star, moon, sun…

**AAB pattern:**
🐘🐘🦁🐘🐘🦁 — elephant, elephant, lion…

### Patterns in Nature 🌿
- Zebra stripes: black, white, black, white
- Sunflower seeds form a spiral pattern
- A snail's shell is a growing pattern

### Activity ✏️
Draw your own pattern using two shapes or two colours. Repeat it 5 times. Ask a friend what comes next!`,
  },
  {
    title: "Sorting and Classifying",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "Z-eM5m5UZlo", durationMinutes: 3,
    description: "Put objects into groups by colour, shape, size or type.",
    thumbnailUrl: "https://img.youtube.com/vi/Z-eM5m5UZlo/hqdefault.jpg",
    milestone: null,
    content: `## Sorting Things Into Groups 🗂️

**Sorting** means putting things together that are the same in some way.

### We can sort by…

**Colour 🎨** — Put all the red things together. All the blue things together.

**Shape 🔺** — Put all circles in one group. All squares in another.

**Size 📏** — Big objects here. Small objects there.

**Type 🐾** — Animals here. Plants there. Food over there.

### Why sorting matters
Sorting helps us organise, count, and understand the world around us.

### Activity 🫘
Find 10–15 small objects at home (pebbles, buttons, leaves, seeds). Sort them into two groups. How did you choose to sort them? Sort them a different way!`,
  },
  {
    title: "Telling the Time",
    subject: "Mathematics", classLevel: "ECD B",
    youtubeId: "xdR7s8mwyp8", durationMinutes: 5,
    description: "Learn to read a clock and tell what time it is.",
    thumbnailUrl: "https://img.youtube.com/vi/xdR7s8mwyp8/hqdefault.jpg",
    milestone: null,
    content: `## What Time Is It? ⏰

A **clock** has two hands:
- The **short hand** points to the **hour**
- The **long hand** points to the **minutes**

### O'clock Times
When the long hand points straight up (12), we say **o'clock**.

| Short hand on | We say |
|---------------|--------|
| 1 | 1 o'clock |
| 6 | 6 o'clock |
| 8 | 8 o'clock |

### Our Day by the Clock 🌅
- **6 o'clock** — wake up
- **8 o'clock** — school starts
- **12 o'clock** — lunchtime (midday)
- **3 o'clock** — school ends
- **7 o'clock** — bedtime

### Activity 🖊️
Draw a clock face. Draw hands to show 7 o'clock. Then draw another showing 3 o'clock.`,
  },
  {
    title: "Writing Numbers 0 to 10",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "pzmB0GoEKkA", durationMinutes: 4,
    description: "Practise writing each number neatly and correctly.",
    thumbnailUrl: "https://img.youtube.com/vi/pzmB0GoEKkA/hqdefault.jpg",
    milestone: "Counts to 20",
    content: `## Writing Numbers ✏️

Learning to write numbers takes practice. Let's do it carefully!

### How to Write Each Number

**0** — Draw an oval, start at the top, go left and around.
**1** — A straight line down.
**2** — Curve right at top, go down and across.
**3** — Two bumps on the right side.
**4** — Line down, line across, line up.
**5** — Line down, bump right, flat top.
**6** — Curve around and make a circle at the bottom.
**7** — Flat top, diagonal line down.
**8** — Make two circles on top of each other.
**9** — Circle at top, line down.
**10** — Write 1, then 0 beside it.

### Remember
- Start at the top
- Use your finger to trace in the air first
- Then write on paper

### Activity ✏️
Write each number from 0 to 10 three times. Then count real objects to match each number.`,
  },
  {
    title: "More, Less and Equal",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "uONIJ5TQ2DA", durationMinutes: 3,
    description: "Compare two groups to find out which has more, less, or if they are equal.",
    thumbnailUrl: "https://img.youtube.com/vi/uONIJ5TQ2DA/hqdefault.jpg",
    milestone: null,
    content: `## Comparing Numbers ⚖️

When we have two groups, we can compare them.

| Sign | Meaning | Example |
|------|---------|---------|
| **>** | greater than (more) | 7 > 3 |
| **<** | less than (fewer) | 2 < 8 |
| **=** | equal to (same) | 5 = 5 |

### The Crocodile Trick 🐊
The hungry crocodile **always opens its mouth to eat the bigger number!**
- 6 **>** 4 (crocodile eats the 6)
- 2 **<** 9 (crocodile eats the 9)

### Activity 🫘
Get two groups of pebbles. Count each group. Write which is more and which is less. Can you make them equal by adding or removing some?`,
  },
  {
    title: "Colours — The Rainbow",
    subject: "Mathematics", classLevel: "ECD A",
    youtubeId: "s0p9P9KOQSk", durationMinutes: 3,
    description: "Learn colour names and sort objects by colour.",
    thumbnailUrl: "https://img.youtube.com/vi/s0p9P9KOQSk/hqdefault.jpg",
    milestone: "Recognizes shapes & colors",
    content: `## Colours of the Rainbow 🌈

A rainbow has **7 colours**, always in the same order:

🔴 **Red** · 🟠 **Orange** · 🟡 **Yellow** · 🟢 **Green** · 🔵 **Blue** · 🟣 **Indigo** · 🟣 **Violet**

Remember it with: **ROY G BIV**

### Colours in Shona
| English | Shona |
|---------|-------|
| Red | tsvuku |
| Blue | bhuruu |
| Yellow | chena-yero |
| Green | girini |
| White | chena |
| Black | nhema |

### Activity 🎨
Look outside. How many colours can you find in nature right now? Draw a rainbow and colour it in the correct order.`,
  },

  // ── ENGLISH ───────────────────────────────────────────────────────────
  {
    title: "My Body — Body Parts",
    subject: "English", classLevel: "ECD A",
    youtubeId: "Rc_kIWKLiD8", durationMinutes: 3,
    description: "Learn the names of the parts of your body in English.",
    thumbnailUrl: "https://img.youtube.com/vi/Rc_kIWKLiD8/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## My Amazing Body 🧍

Your body has many parts, each with an important job!

### Head and Face
- **head** — the top of your body
- **eyes** 👁️ — for seeing
- **ears** 👂 — for hearing
- **nose** 👃 — for smelling and breathing
- **mouth** 👄 — for eating and talking
- **hair** — grows on your head

### Body
- **neck** — joins head to body
- **shoulders** — top of your arms
- **chest** — front of your upper body
- **stomach / tummy** — where food goes
- **back** — behind your body

### Arms and Legs
- **arms**, **hands**, **fingers** (10 fingers!)
- **legs**, **feet**, **toes** (10 toes!)

### Activity 🎶
Sing *Head, Shoulders, Knees and Toes*. Touch each body part as you name it!`,
  },
  {
    title: "Action Words — Verbs",
    subject: "English", classLevel: "ECD A",
    youtubeId: "KKVDvv4jBCw", durationMinutes: 3,
    description: "Learn action words — the words that describe what we do.",
    thumbnailUrl: "https://img.youtube.com/vi/KKVDvv4jBCw/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## Action Words — Verbs 🏃

A **verb** is a word that tells us what someone or something **does**.

### Common Action Verbs
| Verb | Sentence |
|------|----------|
| **run** | I can run fast! |
| **jump** | The frog can jump high. |
| **sit** | Please sit down. |
| **eat** | We eat breakfast in the morning. |
| **sing** | I love to sing! |
| **dance** | We dance at celebrations. |
| **draw** | I draw pictures every day. |
| **sleep** | We sleep at night. |
| **clap** | Clap your hands! 👏 |
| **fly** | Birds can fly. |

### Using Verbs in Sentences
*Subject + Verb* = a simple sentence
- **Tendai runs.** · **Rudo sings.** · **The dog barks.**

### Activity ✏️
Write 5 sentences. Each sentence must use a different verb.`,
  },
  {
    title: "Opposites — Words That Are Different",
    subject: "English", classLevel: "ECD A",
    youtubeId: "Qfl9m0sff-4", durationMinutes: 3,
    description: "Learn pairs of opposite words like hot/cold and up/down.",
    thumbnailUrl: "https://img.youtube.com/vi/Qfl9m0sff-4/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## Opposites — Antonyms 🔄

**Opposites** are words with completely different meanings.

### Common Opposites

| Word | Opposite |
|------|----------|
| big | **small** |
| hot | **cold** |
| up | **down** |
| day | **night** |
| fast | **slow** |
| happy | **sad** |
| clean | **dirty** |
| open | **closed** |
| loud | **quiet** |
| full | **empty** |
| hard | **soft** |
| old | **new** |

### In sentences
- The sun is **hot**; ice is **cold**.
- A lion is **big**; an ant is **small**.
- The sky is **up**; the ground is **down**.

### Activity ✏️
Draw two pictures for 5 opposite pairs. For example: a big elephant and a small mouse.`,
  },
  {
    title: "Community Helpers",
    subject: "English", classLevel: "ECD A",
    youtubeId: "O7AzjLTj3-o", durationMinutes: 4,
    description: "Meet the people who help keep our community safe and healthy.",
    thumbnailUrl: "https://img.youtube.com/vi/O7AzjLTj3-o/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## People Who Help Us 🤝

A **community helper** is someone whose job helps other people.

### Community Helpers

**👩‍⚕️ Doctor / Nurse**
Doctors and nurses keep us healthy. They work in hospitals and clinics.

**👮 Police Officer**
Police officers keep us safe and help when there is trouble.

**👩‍🏫 Teacher**
Teachers help children learn at school. *That's your teacher!*

**🚒 Firefighter**
Firefighters put out fires and rescue people.

**👨‍🌾 Farmer**
Farmers grow the food we eat — maize, vegetables, fruit.

**🚌 Bus Driver**
Bus drivers take people safely from place to place.

**👷 Builder / Builder**
Builders construct houses, schools and roads.

### Activity ✏️
Draw your favourite community helper. Write one sentence about what they do.`,
  },
  {
    title: "Months of the Year",
    subject: "English", classLevel: "ECD B",
    youtubeId: "vW10YzD1CT8", durationMinutes: 3,
    description: "Learn the 12 months of the year and when the seasons come.",
    thumbnailUrl: "https://img.youtube.com/vi/vW10YzD1CT8/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## The 12 Months of the Year 📅

There are **12 months** in a year. Together they make 365 days.

| Month | Number | Season in Zimbabwe |
|-------|--------|--------------------|
| January | 1 | Rainy season ☔ |
| February | 2 | Rainy season ☔ |
| March | 3 | End of rains 🌤️ |
| April | 4 | Autumn 🍂 |
| May | 5 | Cool and dry ❄️ |
| June | 6 | Cold season 🥶 |
| July | 7 | Cold season 🥶 |
| August | 8 | Dry season ☀️ |
| September | 9 | Spring 🌸 |
| October | 10 | Hot and dry 🌡️ |
| November | 11 | First rains 🌧️ |
| December | 12 | Rainy season ☔ |

### Activity ✏️
What month is your birthday? Write it down and draw a picture of what the weather is like during that month in Zimbabwe.`,
  },
  {
    title: "The Weather",
    subject: "English", classLevel: "ECD A",
    youtubeId: "3yIuU6sh2wU", durationMinutes: 3,
    description: "Learn to describe different types of weather in English.",
    thumbnailUrl: "https://img.youtube.com/vi/3yIuU6sh2wU/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## What's the Weather Like Today? ⛅

The **weather** is what the air outside is like. It changes every day!

### Weather Words
| Weather | Symbol | Description |
|---------|--------|-------------|
| Sunny | ☀️ | Bright and warm — the sun shines! |
| Cloudy | ⛅ | Clouds cover the sky |
| Rainy | 🌧️ | Water falls from clouds |
| Windy | 💨 | The air blows strongly |
| Stormy | ⛈️ | Rain, wind and lightning together |
| Foggy | 🌫️ | Thick mist makes it hard to see |

### Useful Sentences
- *Today it is **sunny**.*
- *It is **cold** and **cloudy** today.*
- *I need my umbrella because it is **raining**.*

### Activity 🗓️
Keep a weather diary for 5 days. Draw a weather symbol for each day and write one sentence.`,
  },
  {
    title: "Manners and Kindness",
    subject: "English", classLevel: "ECD A",
    youtubeId: "1eCdTfkxbJc", durationMinutes: 3,
    description: "Learn the magic words that show good manners.",
    thumbnailUrl: "https://img.youtube.com/vi/1eCdTfkxbJc/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## The Magic Words 🌟

Good manners show that we respect and care about other people.

### Magic Words to Remember

| Situation | Magic Words |
|-----------|-------------|
| Asking for something | **"Please"** |
| Receiving something | **"Thank you"** |
| Bumping into someone | **"Sorry" / "Excuse me"** |
| Someone sneezes | **"Bless you"** |
| Entering a room | **"May I come in?"** |
| Meeting someone | **"Hello! How are you?"** |
| Leaving | **"Goodbye! Take care."** |

### More Good Manners
- Listen when others are speaking 👂
- Share with your friends 🤝
- Help when someone needs it 💪
- Use a quiet voice indoors 🤫
- Say "yes please" and "no thank you"

### Activity 🎭
Practise these conversations with a friend or family member. Take turns being polite!`,
  },
  {
    title: "Feelings and Emotions",
    subject: "English", classLevel: "ECD A",
    youtubeId: "eMOnyPxE_w8", durationMinutes: 4,
    description: "Learn to name and talk about your feelings in English.",
    thumbnailUrl: "https://img.youtube.com/vi/eMOnyPxE_w8/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## How Are You Feeling? 😊

Everyone has **feelings** — they are the emotions inside us. It is good to know their names so we can talk about them.

### Feelings Chart
| Feeling | Face | When? |
|---------|------|-------|
| **Happy** | 😊 | When something nice happens |
| **Sad** | 😢 | When something disappoints us |
| **Angry** | 😠 | When something feels unfair |
| **Scared** | 😨 | When something frightens us |
| **Surprised** | 😲 | When something unexpected happens |
| **Excited** | 🤩 | When something wonderful is coming |
| **Tired** | 😴 | When we need rest |
| **Proud** | 😌 | When we do something well |

### Sharing Feelings
*"I feel _____ because _____ ."*
- "I feel **happy** because I got a gold star."
- "I feel **scared** because it is dark."

### Activity ✏️
Draw 4 faces showing different feelings. Write the name of each feeling beneath it.`,
  },
  {
    title: "Classic Nursery Rhymes",
    subject: "English", classLevel: "ECD A",
    youtubeId: "k76XelYleyU", durationMinutes: 5,
    description: "Enjoy classic nursery rhymes that help children learn rhythm and language.",
    thumbnailUrl: "https://img.youtube.com/vi/k76XelYleyU/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## Nursery Rhymes 🎵

Nursery rhymes are short poems and songs for children. They help us learn language, rhythm, and memory.

### Humpty Dumpty
*Humpty Dumpty sat on a wall,*
*Humpty Dumpty had a great fall.*
*All the king's horses and all the king's men*
*Couldn't put Humpty together again.*

### Twinkle Twinkle Little Star ⭐
*Twinkle, twinkle, little star,*
*How I wonder what you are!*
*Up above the world so high,*
*Like a diamond in the sky.*

### Baa Baa Black Sheep 🐑
*Baa baa black sheep, have you any wool?*
*Yes sir, yes sir, three bags full!*

### Why We Love Rhymes
- They use **rhyming words** (wall/fall, star/are)
- They teach **rhythm** — the beat of language
- They are easy to **remember**

### Activity 🎶
Choose your favourite rhyme. Clap the beat as you say it out loud.`,
  },
  {
    title: "Transport and Vehicles",
    subject: "English", classLevel: "ECD A",
    youtubeId: "fGEyttZb5Qk", durationMinutes: 4,
    description: "Learn the names of vehicles that take us from place to place.",
    thumbnailUrl: "https://img.youtube.com/vi/fGEyttZb5Qk/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## How We Travel 🚌

**Transport** means ways of moving people and things from one place to another.

### Land Transport 🛣️
| Vehicle | What it does |
|---------|-------------|
| 🚗 Car | Carries families on roads |
| 🚌 Bus | Carries many people |
| 🚂 Train | Travels on railway tracks |
| 🚲 Bicycle | Pedal with your legs |
| 🚛 Truck | Carries heavy loads |

### Water Transport 🌊
- 🚢 **Ship** — sails across the ocean
- 🚤 **Boat** — travels on rivers and lakes

### Air Transport ✈️
- ✈️ **Aeroplane** — flies in the sky
- 🚁 **Helicopter** — can take off and land anywhere

### Transport in Zimbabwe
In Zimbabwe, most people travel by **kombi** (minibus), **bus**, or on **foot**. Some travel by **bicycle** or **car**.

### Activity ✏️
Draw your favourite vehicle. Write three sentences about it.`,
  },
  {
    title: "Sight Words — High-Frequency Words",
    subject: "English", classLevel: "ECD B",
    youtubeId: "0jDSzVmmHOw", durationMinutes: 4,
    description: "Learn the most common words in English so reading becomes easier.",
    thumbnailUrl: "https://img.youtube.com/vi/0jDSzVmmHOw/hqdefault.jpg",
    milestone: "Speaks in full sentences (English)",
    content: `## Sight Words 👁️

**Sight words** are words that appear very often in books. If you can recognise them at a glance, reading becomes much faster and easier!

### List 1 — Easiest
the · a · I · is · it · in · to · and · we · my

### List 2 — Common
**you** · **he** · **she** · **they** · **we** · **are** · **was** · **can** · **do** · **go**

### List 3 — More Words
**have** · **like** · **this** · **that** · **with** · **from** · **look** · **come** · **said** · **play**

### How to Learn Sight Words
1. Write each word on a small card
2. Read it out loud 3 times
3. Spell it letter by letter
4. Look for it in books and sentences

### Activity ✏️
Write each word from List 1 in your best handwriting. Then make a sentence using 3 of them.`,
  },

  // ── SHONA ─────────────────────────────────────────────────────────────
  {
    title: "Mangwanani! — Shona Greetings",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "iYD6Gnpvf64", durationMinutes: 3,
    description: "Learn how to greet people in Shona — morning, afternoon and evening.",
    thumbnailUrl: "https://img.youtube.com/vi/iYD6Gnpvf64/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Kugamuchira — Shona Greetings 🤝

In Zimbabwe, greetings are very important. We always greet before talking!

### Time-Based Greetings
| English | Shona | When |
|---------|-------|------|
| Good morning | **Mangwanani** | Morning |
| Good afternoon | **Masikati** | Midday/afternoon |
| Good evening | **Manheru** | Evening |
| Good night | **Usiku wakanaka** | Before sleep |

### Responding to Greetings
When someone greets you, you reply:
- *Mangwanani!* → **Mangwanani!**
- *Makadii?* (How are you?) → **Ndiripona, maita basa** (I am well, thank you)
- *Zvirisei?* (How things?) → **Zviripo** (Things are fine)

### Other Useful Phrases
- *Ndinokuda* — I love you
- *Ndatenda* — Thank you
- *Pamhata!* — Bye!

### Activity 🎭
Practise greeting a family member in Shona, using the correct greeting for the time of day.`,
  },
  {
    title: "Nhamba muChiShona — Numbers in Shona",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "i9jTvI_etEo", durationMinutes: 4,
    description: "Count from 1 to 10 in Shona and learn to use numbers in sentences.",
    thumbnailUrl: "https://img.youtube.com/vi/i9jTvI_etEo/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Nhamba — Numbers in Shona 🔢

| Number | Shona | Pronunciation |
|--------|-------|---------------|
| 1 | **rimwe** | rim-way |
| 2 | **piri** | pee-ree |
| 3 | **tatu** | tah-too |
| 4 | **ina** | ee-nah |
| 5 | **shanu** | shah-noo |
| 6 | **tanhatu** | tan-hah-too |
| 7 | **nomwe** | nom-way |
| 8 | **sere** | seh-reh |
| 9 | **pfumbamwe** | pfoom-bam-way |
| 10 | **gumi** | goo-mee |

### Using Numbers in Sentences
- *Ndinemombe mbiri.* — I have two cows.
- *Pane vana vatatu pano.* — There are three children here.
- *Ndine makore mashanu.* — I am five years old.

### Activity ✏️
Write the Shona words for 1–10 from memory. Then count five objects at home and write: *Ndinezvinhu zvishanu.* (I have five things.)`,
  },
  {
    title: "Mavara eChiShona — Shona Colours",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "B9xVEaTCp2w", durationMinutes: 3,
    description: "Learn the names of colours in Shona.",
    thumbnailUrl: "https://img.youtube.com/vi/B9xVEaTCp2w/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Mavara — Colours in Shona 🌈

| English | Shona |
|---------|-------|
| Red | **tsvuku** |
| Blue | **bhuruu** |
| Green | **girini** |
| Yellow | **yero** |
| White | **chena** |
| Black | **nhema** |
| Orange | **orenji** |
| Purple | **pfupuru** |
| Pink | **pingi** |

### Sentences Using Colours
- *Gomo iri girini.* — The mountain is green.
- *Zuva iri tsvuku mangwanani.* — The sun is red in the morning.
- *Hembe yangu nyowani yero.* — My new shirt is yellow.

### Activity 🎨
Draw a rainbow and write the Shona name of each colour. Then point to five things around you and say their colour in Shona.`,
  },
  {
    title: "Nhengo dzeMuviri — Body Parts in Shona",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "5zjswWlxyxM", durationMinutes: 3,
    description: "Learn the Shona names for parts of the body.",
    thumbnailUrl: "https://img.youtube.com/vi/5zjswWlxyxM/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Nhengo dzeMuviri — Body Parts 🧍

| English | Shona |
|---------|-------|
| Head | **musoro** |
| Eyes | **maziso** |
| Ears | **nzeve** |
| Nose | **mhino** |
| Mouth | **muromo** |
| Teeth | **mazino** |
| Neck | **mutsipa** |
| Hand | **ruoko** |
| Fingers | **minwe** |
| Leg | **gumbo** |
| Foot | **tsoka** |
| Stomach | **dumbu** |
| Back | **musana** |

### Song — Muimbo weNhengo
*Musoro, mapfudzi, mazino, mazino*
*(Head, shoulders, teeth, teeth)*

### Activity 🖊️
Point to each body part on yourself and say its name in Shona. Then draw a body outline and label 8 parts in Shona.`,
  },
  {
    title: "Mhuka muChiShona — Animals in Shona",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "z_QT_OuSIH4", durationMinutes: 4,
    description: "Learn the Shona names for Zimbabwe's wild and domestic animals.",
    thumbnailUrl: "https://img.youtube.com/vi/z_QT_OuSIH4/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Mhuka — Animals in Shona 🦁

### Wild Animals (Mhuka dzomusango)
| English | Shona |
|---------|-------|
| Lion | **shumba** |
| Elephant | **nzou** |
| Giraffe | **twiza** |
| Zebra | **mbizi** |
| Crocodile | **garwe** |
| Hippo | **mvuu** |
| Monkey | **tsoko** |
| Snake | **nyoka** |

### Domestic Animals (Zvipfuwo)
| English | Shona |
|---------|-------|
| Cow | **mombe** |
| Dog | **imbwa** |
| Cat | **katsi** |
| Goat | **mbudzi** |
| Chicken | **huku** |
| Donkey | **dhongi** |

### Sentences
- *Shumba ndishumba.* — The lion is fierce.
- *Mombe yangu irimo kumunda.* — My cow is in the field.

### Activity ✏️
Draw two wild and two domestic animals. Write their Shona names under each picture.`,
  },
  {
    title: "Chikafu muChiShona — Food in Shona",
    subject: "Shona", classLevel: "ECD B",
    youtubeId: "jdqhcL4V8Ac", durationMinutes: 3,
    description: "Learn the names of traditional Zimbabwean foods in Shona.",
    thumbnailUrl: "https://img.youtube.com/vi/jdqhcL4V8Ac/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Chikafu — Food in Shona 🍽️

Zimbabwe has wonderful traditional foods. Let's learn their Shona names!

### Staple Foods
| Food | Shona |
|------|-------|
| Maize meal / Sadza | **sadza** |
| Vegetables | **muriwo** |
| Meat | **nyama** |
| Relish/stew | **hove/nyama** |
| Groundnuts | **nzungu** |
| Sweet potato | **mbambaira** |

### Fruits
| Fruit | Shona |
|-------|-------|
| Mango | **manga** |
| Orange | **muchorenji** |
| Banana | **bhanana** |
| Watermelon | **pamuwe / wadhimudhimu** |

### At the Table
- *Ndine nzara.* — I am hungry.
- *Ndine nyota.* — I am thirsty.
- *Zvikanaka!* — It is delicious!
- *Ndaguta.* — I am full.

### Activity 🍽️
Draw your favourite Zimbabwean meal. Write three Shona words that describe it.`,
  },
  {
    title: "Nhetembo yeChiShona — Shona Poems and Songs",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "GdngW-tYmyg", durationMinutes: 4,
    description: "Enjoy traditional Shona poems and nursery songs.",
    thumbnailUrl: "https://img.youtube.com/vi/GdngW-tYmyg/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Nhetembo yeChiShona 🎵

Shona has a beautiful tradition of poems, riddles, and songs for children.

### Nhungamiro — Riddles
*Chii chinofamba usiku chisina tsoka?*
(What walks at night without feet?)
**Answer: Mhepo — the wind!**

*Chii chinopinda mumba chisati chakwira musuwo?*
(What enters a house without going through the door?)
**Answer: Chiedza — light!**

### Muimbo — A Shona Song
*Shamwari yangu, shamwari yangu,*
*Ndinokuda shamwari yangu.*
*(My friend, my friend, I love you my friend.)*

### Tsumo — Proverbs
- *Chara chimwe hachitswanyi inda.* — One finger cannot crush a louse. (Teamwork matters!)
- *Kuona chinhu mumwe muromo.* — Seeing something with one mouth. (Share what you know.)

### Activity 🎭
Learn the riddles by heart. Ask your family and see if they know the answers!`,
  },
  {
    title: "Tsumo dzeChiShona — Shona Proverbs",
    subject: "Shona", classLevel: "ECD B",
    youtubeId: "bNd3S0oy1Mo", durationMinutes: 4,
    description: "Discover the wisdom in traditional Shona proverbs.",
    thumbnailUrl: "https://img.youtube.com/vi/bNd3S0oy1Mo/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Tsumo — Shona Proverbs 💬

**Tsumo** are traditional Shona proverbs — short, wise sayings that have been passed down for generations.

### Important Tsumo

**"Chara chimwe hachitswanyi inda."**
*One finger cannot crush a louse.*
👉 Meaning: We need each other. Work as a team.

**"Ukama igasva, hunozadziswa nokudya."**
*A relationship is incomplete; it is made whole by sharing food.*
👉 Meaning: Sharing builds strong relationships.

**"Mwana asingachemi anofira mumbereko."**
*A baby that does not cry dies in the baby wrap.*
👉 Meaning: Speak up! Ask for help when you need it.

**"Kudzidza hakuperi."**
*Learning never ends.*
👉 Meaning: Always keep learning.

### Activity ✏️
Choose your favourite tsumo. Write it out. Draw a picture that shows its meaning. Tell a parent or grandparent which one you chose and why.`,
  },
  {
    title: "Mazita ekufamba — Transport in Shona",
    subject: "Shona", classLevel: "ECD B",
    youtubeId: "MHa1KpO1Ano", durationMinutes: 3,
    description: "Learn the Shona words for different types of transport.",
    thumbnailUrl: "https://img.youtube.com/vi/MHa1KpO1Ano/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Mazita ekufamba — Transport in Shona 🚌

| English | Shona |
|---------|-------|
| Car | **mota** |
| Bus | **bhazi** |
| Bicycle | **bhaisikoro** |
| Train | **chikutu** |
| Aeroplane | **ndege** |
| Boat | **chikepe** |
| Lorry/truck | **rori** |
| Kombi (minibus) | **kombi** |

### Useful Phrases
- *Ndinofamba nebhazi.* — I travel by bus.
- *Baba vanoenda kumba nemota.* — Father goes home by car.
- *Ndege inobhururuka mudenga.* — The aeroplane flies in the sky.
- *Chikutu chinofamba mumugwagwa wechikutu.* — The train travels on railway tracks.

### Activity ✏️
Draw three types of transport you see in your neighbourhood. Write their Shona names under each one.`,
  },
  {
    title: "Mamiriro ekunze — Weather in Shona",
    subject: "Shona", classLevel: "ECD B",
    youtubeId: "7Za1Fv3P9uE", durationMinutes: 3,
    description: "Learn how to describe the weather in Shona.",
    thumbnailUrl: "https://img.youtube.com/vi/7Za1Fv3P9uE/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Mamiriro ekunze — Weather in Shona ☀️

| English | Shona |
|---------|-------|
| Sun | **zuva** |
| Rain | **mvura / refu** |
| Wind | **mhepo** |
| Cloud | **gore** |
| Thunder | **hute / shungu** |
| Lightning | **mheni** |
| Cold | **chando** |
| Hot | **kupisa** |

### Sentences
- *Zuva rako.* — The sun is shining.
- *Mvura iri kunaya.* — It is raining.
- *Mhepo iri kubvuma.* — The wind is blowing.
- *Nhasi kune chando.* — Today it is cold.

### Seasons in Zimbabwe
- **Dry season (May–October):** *Nguva yezhozhwa*
- **Rainy season (November–April):** *Nguva yemvura*

### Activity ✏️
Look outside. Describe today's weather using Shona words. Write 2 sentences.`,
  },
  {
    title: "Shona kuChikoro — Shona at School",
    subject: "Shona", classLevel: "ECD A",
    youtubeId: "GdngW-tYmyg", durationMinutes: 3,
    description: "Learn Shona words you use every day at school.",
    thumbnailUrl: "https://img.youtube.com/vi/GdngW-tYmyg/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## KuChikoro — At School 🏫

Let's learn the Shona words we use every day at school!

### School Objects
| English | Shona |
|---------|-------|
| School | **chikoro** |
| Classroom | **kirasi** |
| Book | **bhuku** |
| Pencil | **pensero** |
| Ruler | **mureza** |
| Bag | **bhegi** |
| Desk | **deski** |
| Teacher | **mudzidzisi** |
| Pupil | **mudzidzi** |

### Useful Classroom Phrases
- *Mudzidzisi, ndinokumbira rubatsiro.* — Teacher, I need help.
- *Handizive.* — I don't know.
- *Ndinoziva!* — I know!
- *Ndapedza.* — I am finished.
- *Ndapinda here?* — May I come in?

### Activity 🎒
Look in your school bag. Name each item in Shona. Ask your teacher how to say any you don't know.`,
  },
  {
    title: "Kubala muChiShona — Reading in Shona",
    subject: "Shona", classLevel: "ECD B",
    youtubeId: "B9xVEaTCp2w", durationMinutes: 4,
    description: "Practise reading simple Shona sentences and short texts.",
    thumbnailUrl: "https://img.youtube.com/vi/B9xVEaTCp2w/hqdefault.jpg",
    milestone: "Speaks in full sentences (Shona)",
    content: `## Kubala — Reading in Shona 📖

Reading in Shona follows its sounds carefully. Each letter has one sound — no silent letters!

### The Shona Vowels
| Vowel | Sound | Example |
|-------|-------|---------|
| **a** | like "ah" | **a**mai (mother) |
| **e** | like "eh" | **e**kisi (axe) |
| **i** | like "ee" | **i**mba (house) |
| **o** | like "oh" | **o**va (to be) |
| **u** | like "oo" | **u**mwe (one) |

### A Short Story to Read Aloud
*Mwana ari pachikoro.*
*Anodzidza bhuku rake.*
*Mudzidzisi ake anomufarira.*

(Translation: The child is at school. He studies his book. His teacher is pleased with him.)

### Activity 📖
Read the short story above 3 times. Try to read it faster each time. Ask a family member to listen and check your pronunciation.`,
  },

  // ── ENVIRONMENTAL SCIENCE ─────────────────────────────────────────────
  {
    title: "The Water Cycle",
    subject: "Environmental Science", classLevel: "ECD B",
    youtubeId: "KM-59ljA4Bs", durationMinutes: 5,
    description: "Discover how water moves from clouds to earth and back again.",
    thumbnailUrl: "https://img.youtube.com/vi/KM-59ljA4Bs/hqdefault.jpg",
    milestone: null,
    content: `## The Water Cycle 💧

Water is always moving and changing! The **water cycle** is the journey water makes — from the sky to the earth and back again.

### The Four Steps

**1. Evaporation ☀️**
The sun heats water in rivers, lakes and oceans. The water turns into invisible water vapour and rises into the sky.

**2. Condensation ☁️**
High in the sky it is cold. The water vapour cools down and forms tiny droplets that make clouds.

**3. Precipitation 🌧️**
When clouds get too heavy, water falls back to earth as rain, hail or snow.

**4. Collection 🌊**
Water collects in rivers, lakes, dams and the ground — and the cycle starts again!

### In Zimbabwe
Zimbabwe's rainy season (November–April) is when the water cycle is most active. Rain fills our rivers and dams for the dry season.

### Activity ✏️
Draw the water cycle with arrows showing each stage. Label each step.`,
  },
  {
    title: "Seasons of the Year",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "FEPU7va9phs", durationMinutes: 4,
    description: "Learn about the different seasons and how they affect animals and plants.",
    thumbnailUrl: "https://img.youtube.com/vi/FEPU7va9phs/hqdefault.jpg",
    milestone: null,
    content: `## The Seasons 🌸🌞🍂❄️

Most of the world has **4 seasons**. Zimbabwe has **2 main seasons**.

### Zimbabwe's Two Seasons
**Rainy Season (November – April) 🌧️**
- Rain falls and grass grows green
- Rivers flow and dams fill up
- Farmers plant their crops
- Animals have plenty to eat and drink

**Dry Season (May – October) ☀️**
- Little or no rain
- Grass turns yellow and brown
- Some rivers dry up
- Farmers harvest their crops

### Four Seasons in Other Countries
🌸 **Spring** — flowers bloom, animals are born
☀️ **Summer** — hot, long days
🍂 **Autumn** — leaves change colour and fall
❄️ **Winter** — cold, sometimes snow

### How Animals Respond
- **Migration:** birds fly to warmer places
- **Hibernation:** some animals sleep through winter

### Activity ✏️
Draw Zimbabwe in the rainy season and in the dry season. Show the differences.`,
  },
  {
    title: "Ocean and Sea Animals",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "a3iJjUKWrkk", durationMinutes: 5,
    description: "Explore the amazing creatures that live under the sea.",
    thumbnailUrl: "https://img.youtube.com/vi/a3iJjUKWrkk/hqdefault.jpg",
    milestone: null,
    content: `## Under the Sea 🌊

The ocean is the largest habitat on Earth. It is home to millions of amazing animals!

### Ocean Animals
| Animal | Fun Fact |
|--------|----------|
| 🐳 Whale | The blue whale is the biggest animal ever! |
| 🦈 Shark | Has rows of teeth that grow back when lost |
| 🐠 Clownfish | Lives among the stinging sea anemone safely |
| 🐙 Octopus | Has 8 arms and can change colour! |
| 🐢 Sea Turtle | Can live for over 100 years |
| 🦑 Squid | Shoots ink to escape from enemies |
| ⭐ Starfish | Can grow back a lost arm! |
| 🐬 Dolphin | Very clever and communicate with sounds |

### Lake Kariba — Zimbabwe's Ocean!
Zimbabwe has no sea, but **Lake Kariba** is one of the world's largest manmade lakes. It is home to fish like bream (mbeva) and tigerfish (hungwe)!

### Activity 🎨
Draw your favourite sea creature. Write 3 fun facts about it.`,
  },
  {
    title: "Insects — Amazing Bugs",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "biJTcuZ3OSc", durationMinutes: 4,
    description: "Learn about the fascinating world of insects.",
    thumbnailUrl: "https://img.youtube.com/vi/biJTcuZ3OSc/hqdefault.jpg",
    milestone: null,
    content: `## Amazing Insects! 🐛

**Insects** are the most common animals on Earth. There are more insects than any other type of creature!

### What Makes an Insect?
All insects have:
- **6 legs** (3 pairs)
- **3 body parts** (head, thorax, abdomen)
- **2 antennae**
- Most have **wings**

### Common Insects in Zimbabwe
| Insect | Shona name | Fun fact |
|--------|-----------|----------|
| 🦋 Butterfly | **shavishavi** | Drinks nectar from flowers |
| 🐝 Bee | **nyuchi** | Makes honey and pollinates flowers |
| 🐜 Ant | **siafu/chinyi** | Can carry 50 times its own weight! |
| 🦗 Cricket | **chigavakava** | Males chirp by rubbing their wings |
| 🐛 Caterpillar | **mhongorosi** | Becomes a butterfly! |

### Metamorphosis 🦋
A butterfly's life: **egg → caterpillar → chrysalis → butterfly**

### Activity 🔍
Go outside and find 3 different insects. Draw each one and write its name.`,
  },
  {
    title: "Birds of Zimbabwe",
    subject: "Environmental Science", classLevel: "ECD B",
    youtubeId: "DFgn8BlGfWE", durationMinutes: 4,
    description: "Meet the beautiful birds of Zimbabwe and learn about their special features.",
    thumbnailUrl: "https://img.youtube.com/vi/DFgn8BlGfWE/hqdefault.jpg",
    milestone: null,
    content: `## Birds of Zimbabwe 🦅

Zimbabwe has over **650 species of birds** — more than all of Europe combined!

### Zimbabwe's National Bird
🦅 **The African Fish Eagle** (*hungwe* in Shona) is Zimbabwe's national bird. Its distinctive call is the "sound of Africa." It catches fish from rivers and lakes.

### Famous Zimbabwe Birds
| Bird | Shona | Special feature |
|------|-------|----------------|
| African Fish Eagle | **hungwe** | National bird, strong cry |
| Lilac-breasted Roller | **ngura** | Beautiful rainbow colours |
| Secretary Bird | — | Long legs, hunts snakes on foot |
| Flamingo | **tunduru** | Pink, lives in lakes |
| Crowned Crane | — | Golden crown on head |
| Marabou Stork | **gumunhu** | Very large with big bill |

### Parts of a Bird
- **Beak/Bill** — for eating
- **Wings** — for flying
- **Feathers** — keep warm, help fly
- **Talons** — sharp claws for gripping
- **Tail** — helps steer when flying

### Activity 🎨
Draw the African Fish Eagle. Label its wings, beak, talons and tail.`,
  },
  {
    title: "Recycling and Our Environment",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "AOvcW8l3RzE", durationMinutes: 4,
    description: "Learn how recycling helps protect the earth we all share.",
    thumbnailUrl: "https://img.youtube.com/vi/AOvcW8l3RzE/hqdefault.jpg",
    milestone: null,
    content: `## Reduce, Reuse, Recycle ♻️

We only have **one Earth**. We must look after it for future children.

### The 3 Rs

**♻️ Reduce**
Use less. Buy only what you need. Turn off lights and taps.

**🔄 Reuse**
Use things again. Use both sides of paper. Use a cloth bag, not a plastic one.

**🌿 Recycle**
Turn old things into new ones:
- Paper → new paper
- Plastic bottles → garden pots
- Old clothes → cleaning rags or toys

### What We Must NOT Do
- ❌ Drop litter in rivers or parks
- ❌ Burn plastic (it releases toxic smoke)
- ❌ Cut down trees without planting new ones
- ❌ Pour chemicals into rivers

### What Animals Need from Us
Trees give animals shelter. Rivers give them water. When we pollute, they suffer.

### Activity 🎨
Draw a clean school or home environment. Then draw the same place with litter. Which do you prefer?`,
  },
  {
    title: "Our Amazing Body",
    subject: "Environmental Science", classLevel: "ECD B",
    youtubeId: "XfS8O4KlHVM", durationMinutes: 5,
    description: "Learn about the human body's organs and how they work together.",
    thumbnailUrl: "https://img.youtube.com/vi/XfS8O4KlHVM/hqdefault.jpg",
    milestone: null,
    content: `## The Human Body 🫀

Your body is an incredible machine! Different **organs** work together to keep you alive and healthy.

### Key Organs

**🧠 Brain**
Your brain controls everything — thinking, feeling, moving, breathing.

**❤️ Heart**
Your heart pumps blood around your whole body. Put your hand on your chest — can you feel it beating?

**🫁 Lungs**
You have two lungs. They breathe air in and out, giving your blood oxygen.

**🦷 Teeth**
Your teeth break food into small pieces so you can swallow it.

**🦴 Skeleton**
Your 206 bones give your body its shape and protect your organs.

**💪 Muscles**
Muscles attached to your bones help you move, run and jump.

### Staying Healthy
- Eat vegetables and fruit 🥦🍎
- Drink clean water 💧
- Sleep 9–10 hours each night 😴
- Exercise and play outside 🏃
- Wash hands before eating 🤲

### Activity ✏️
Draw a body outline. Label the brain, heart, lungs, and bones.`,
  },
  {
    title: "Our Five Senses",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "zAwhBY9pJSk", durationMinutes: 4,
    description: "Explore the five senses and the body parts we use to sense the world.",
    thumbnailUrl: "https://img.youtube.com/vi/zAwhBY9pJSk/hqdefault.jpg",
    milestone: null,
    content: `## The Five Senses 👁️👂👃👄✋

Our **five senses** help us understand the world around us!

| Sense | Body Part | What we do |
|-------|-----------|-----------|
| 👁️ **Sight** | Eyes | See colours, shapes, light |
| 👂 **Hearing** | Ears | Hear sounds, music, voices |
| 👃 **Smell** | Nose | Smell flowers, food, rain |
| 👄 **Taste** | Tongue | Taste sweet, sour, salty, bitter |
| ✋ **Touch** | Skin | Feel rough, smooth, hot, cold |

### Describing with the Senses
- The mango **smells** sweet.
- The sand **feels** rough.
- The drum **sounds** loud.
- The lemon **tastes** sour.
- The sunset **looks** beautiful.

### A World Without Senses
Some people cannot see — they are **blind**. Some cannot hear — they are **deaf**. We must be kind and helpful to them.

### Activity 🎭
Close your eyes. Ask someone to hand you 5 objects. Without looking, describe how each one feels — is it rough/smooth, hard/soft, cold/warm?`,
  },
  {
    title: "The Sun, Moon and Stars",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "iF_ukhQrsiE", durationMinutes: 4,
    description: "Learn about the sun, moon and stars in our solar system.",
    thumbnailUrl: "https://img.youtube.com/vi/iF_ukhQrsiE/hqdefault.jpg",
    milestone: null,
    content: `## Our Solar System ☀️🌙⭐

### The Sun ☀️
The **sun** is a giant star — a ball of burning gas! It is very far away but so powerful we can feel its warmth. The sun gives us **light** and **heat**. Without the sun, nothing could grow and Earth would be frozen.

### The Moon 🌙
The **moon** is Earth's companion. It travels around Earth once a month. The moon does not make its own light — it **reflects** sunlight. That is why the moon seems to glow at night!

**Phases of the Moon:**
🌑 New Moon → 🌒 Crescent → 🌓 Half Moon → 🌕 Full Moon → 🌘 back to New

### Stars ⭐
Stars are suns, just very far away! On a clear night you can see thousands of stars. Groups of stars form **constellations** — patterns like the Southern Cross.

### Day and Night
The Earth spins. When our side faces the sun → **day**. When it faces away → **night**.

### Activity 🌙
Tonight, look at the moon. Is it a full moon, crescent, or new moon? Draw it.`,
  },
  {
    title: "Food Chains",
    subject: "Environmental Science", classLevel: "ECD B",
    youtubeId: "5Gv9yuN2Ch8", durationMinutes: 4,
    description: "Discover how energy passes from plants to animals in a food chain.",
    thumbnailUrl: "https://img.youtube.com/vi/5Gv9yuN2Ch8/hqdefault.jpg",
    milestone: null,
    content: `## Food Chains 🌿➡️🐛➡️🐦

A **food chain** shows what animals eat and where they get their energy from.

### How It Works
**Producer** → **Herbivore** → **Carnivore**

*Sun → Grass → Zebra → Lion*

The **sun** gives energy to **plants** (producers). Animals that eat plants are **herbivores**. Animals that eat other animals are **carnivores**. Animals that eat both are **omnivores**.

### A Zimbabwe Food Chain Example
🌿 Grass → 🦓 Zebra → 🦁 Lion → 🦅 Vulture (eats leftovers)

### Another Example
🍃 Leaves → 🐛 Caterpillar → 🐦 Bird → 🐆 Cheetah

### What Happens if One is Removed?
If all the zebras disappeared, lions would have nothing to eat! Every animal is important.

### Vocabulary
- **Prey:** the animal that is eaten
- **Predator:** the animal that does the eating
- **Decomposer:** breaks down dead things (worms, fungi)

### Activity ✏️
Draw your own food chain with 4 animals from Zimbabwe.`,
  },
  {
    title: "Rocks, Soil and the Ground",
    subject: "Environmental Science", classLevel: "ECD B",
    youtubeId: "IKXP3vGy0as", durationMinutes: 4,
    description: "Explore the different types of rocks and soil under our feet.",
    thumbnailUrl: "https://img.youtube.com/vi/IKXP3vGy0as/hqdefault.jpg",
    milestone: null,
    content: `## Rocks and Soil 🪨

The ground beneath us is made of rocks and soil. Let's explore!

### Types of Rock
| Type | How it forms | Examples |
|------|-------------|----------|
| **Igneous** | From cooled lava/magma | Granite (used in Great Zimbabwe!) |
| **Sedimentary** | From layers of sand and mud | Sandstone, limestone |
| **Metamorphic** | Changed by heat and pressure | Marble, quartzite |

### What is Soil?
**Soil** is made of:
- Tiny broken pieces of rock
- Dead plant and animal material
- Water and air
- Billions of tiny organisms (worms, bacteria)

### Types of Soil
- **Clay soil** — sticks together when wet
- **Sandy soil** — water drains through quickly
- **Loam** — best for plants! Mix of clay, sand and humus

### Worms and Soil 🪱
Earthworms are soil heroes! They dig tunnels that let air and water into the soil, making it better for plants.

### Activity 🪨
Collect 3 different rocks. Describe their colour, texture, and weight.`,
  },
  {
    title: "Taking Care of Our Earth",
    subject: "Environmental Science", classLevel: "ECD A",
    youtubeId: "v_gv3JSOM_c", durationMinutes: 3,
    description: "Learn why we must protect nature and practical ways children can help.",
    thumbnailUrl: "https://img.youtube.com/vi/v_gv3JSOM_c/hqdefault.jpg",
    milestone: null,
    content: `## We Care for the Earth 🌍

The Earth is our home — and the home of every animal and plant. We must take care of it!

### Why the Earth Needs Our Help
- Forests are being cut down
- Rivers are being polluted with litter and chemicals
- Animals are losing their homes
- The air in cities is becoming dirty

### How YOU Can Help — Right Now!

**At home 🏠**
- Turn off lights when you leave a room
- Use both sides of paper before throwing it away
- Help water the garden

**At school 📚**
- Put litter in the bin — never on the ground
- Plant a tree or garden

**In the community 🌳**
- Join clean-up activities
- Tell adults when you see someone littering

### Famous Quote
*"The Earth does not belong to us. We belong to the Earth."*

### Activity 🌱
Plant one seed in a cup of soil. Water it every day for two weeks. Write or draw what you observe.`,
  },

  // ── VISUAL & PERFORMING ARTS ──────────────────────────────────────────
  {
    title: "Drawing a House — Step by Step",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "YmtmuHZcyHY", durationMinutes: 5,
    description: "Learn to draw a house using simple shapes.",
    thumbnailUrl: "https://img.youtube.com/vi/YmtmuHZcyHY/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## How to Draw a House 🏠

Drawing a house is easy when you break it into simple shapes!

### Step by Step

1. Draw a **large square** — this is the main wall of the house
2. Draw a **triangle on top** — this is the roof
3. Draw a **small rectangle** in the centre — this is the door
4. Draw **two small squares** on the walls — these are windows
5. Draw a **long rectangle** at the bottom — this is the path
6. Add a **chimney** on the roof (a small rectangle)
7. Draw a **sun** 🌞 and some **trees** 🌳 around the house

### Adding Details
- Draw **curtains** in the windows
- Add **smoke** coming from the chimney
- Draw a **garden** with flowers

### Colouring Tips
- **Walls:** light brown or cream
- **Roof:** red or orange
- **Door:** dark brown or blue
- **Windows:** light blue

### Activity 🎨
Draw and colour your own dream house. Make it as detailed as possible!`,
  },
  {
    title: "Drawing Flowers — Petal by Petal",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "DJqlLeD0EGA", durationMinutes: 4,
    description: "Draw beautiful flowers using circles, ovals and curved lines.",
    thumbnailUrl: "https://img.youtube.com/vi/DJqlLeD0EGA/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Drawing Flowers 🌸

Flowers have beautiful shapes. Let's draw them step by step!

### Simple Flower (5 petals)
1. Draw a **small circle** in the centre
2. Around it, draw **5 oval shapes** (petals) evenly spaced
3. Draw a **long stem** going down
4. Add two **leaves** on the sides of the stem
5. Colour the petals bright colours

### The Sunflower 🌻
1. Draw a **large circle** in the middle
2. Draw **long oval petals** all around the outside
3. Fill the centre with small dots
4. Draw a **tall green stem** and **two large leaves**

### Drawing Tips
- Petals don't have to be perfect — real flowers aren't either!
- Use **warm colours** (red, orange, yellow, pink) for petals
- Use **green** for stems and leaves
- Press lightly first, then add colour

### Zimbabwe's Wild Flowers 🌺
Zimbabwe has beautiful wild flowers like the **flame lily** (*chitungu*) — Zimbabwe's national flower! It is red and yellow.

### Activity 🎨
Draw three different flowers. Colour each one a different way.`,
  },
  {
    title: "Drawing People — Simple Figures",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "uXlO6ocidiY", durationMinutes: 4,
    description: "Learn how to draw a simple human figure.",
    thumbnailUrl: "https://img.youtube.com/vi/uXlO6ocidiY/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Drawing People 🧍

Drawing a person is simple when you use basic shapes!

### The Simple Figure
1. **Head:** Draw a circle at the top
2. **Neck:** A short line below the circle
3. **Body:** A rectangle (or oval) below the neck
4. **Arms:** Two lines going out from the sides of the body, ending with small circles (hands)
5. **Legs:** Two lines going down from the body, ending with small ovals (feet)

### Adding a Face
Inside the head circle:
- **Eyes:** Two small circles or ovals
- **Nose:** A small triangle or dot
- **Mouth:** A curved line (smile!)
- **Hair:** Lines or a shape at the top

### Stick Figure (Even Simpler!)
Use just lines: a circle head, one line down for the body, two lines for arms, two lines for legs. Even stick figures tell a story!

### Adding Clothes
Draw clothes on top of the body shape — a dress, trousers, shirt, or school uniform.

### Activity 🎨
Draw yourself and your family. Give everyone different hair and clothes. Label each person.`,
  },
  {
    title: "Mixing Colours — Primary and Secondary",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "-U3VIgZ4byY", durationMinutes: 4,
    description: "Discover what happens when you mix two colours together.",
    thumbnailUrl: "https://img.youtube.com/vi/-U3VIgZ4byY/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Mixing Colours 🎨

Only **3 colours** can make almost all other colours. They are called **primary colours**.

### Primary Colours (Cannot be made by mixing)
🔴 **Red** + 🔵 **Blue** + 🟡 **Yellow**

### Secondary Colours (Made by mixing 2 primaries)
| Mix | Result |
|-----|--------|
| 🔴 Red + 🟡 Yellow | 🟠 **Orange** |
| 🟡 Yellow + 🔵 Blue | 🟢 **Green** |
| 🔵 Blue + 🔴 Red | 🟣 **Purple** |

### More Mixing
- White + any colour = **lighter** (tint)
- Black + any colour = **darker** (shade)
- Red + White = **Pink** 🩷

### The Colour Wheel 🎡
Artists arrange colours in a circle called the **colour wheel**. Colours next to each other are **harmonious**. Colours opposite each other are **complementary** (they make each other look bright!).

### Activity 🖌️
Mix paints or colour pencils together. Try to make orange, green and purple. Draw a colour wheel!`,
  },
  {
    title: "Finger Painting — Texture and Touch",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "tGn4H9YUxf0", durationMinutes: 4,
    description: "Explore art through finger painting and learn about texture.",
    thumbnailUrl: "https://img.youtube.com/vi/tGn4H9YUxf0/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Finger Painting! 🖐️

Finger painting is one of the oldest forms of art. You use your fingers, palms, and hands to create pictures!

### What You Can Create
- **Fingerprint animals:** Press your thumb and add legs → ant or spider!
- **Palm prints:** Print your whole hand and add a trunk → elephant!
- **Splatter patterns:** Flick paint for a sky of stars
- **Landscape:** Use the side of your hand to make hills

### Techniques
| Technique | How |
|-----------|-----|
| Swirl | Move finger in circles |
| Dot | Press fingertip gently |
| Drag | Pull finger across surface |
| Stamp | Press palm flat, lift off |
| Blend | Smear two wet colours together |

### Texture in Art
**Texture** is how something feels — rough, smooth, bumpy, soft. In art, we show texture through lines and patterns.

### Activity 🖐️
Use your fingers to paint a scene of Zimbabwe — blue sky, green hills, one animal. Try using at least 3 colours.`,
  },
  {
    title: "Paper Craft — Folding and Creating",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "pFfBrCyHfWs", durationMinutes: 5,
    description: "Make fun paper crafts and learn basic folding techniques.",
    thumbnailUrl: "https://img.youtube.com/vi/pFfBrCyHfWs/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Paper Craft 📄

Paper is one of the most versatile art materials. Let's make things with it!

### Paper Fan 🌬️
1. Take a rectangle of paper
2. Fold it back and forth in equal strips (accordion style)
3. Pinch one end together and hold tight
4. Fan out the other end
5. Decorate with patterns!

### Paper Boat ⛵
1. Fold paper in half (top to bottom)
2. Fold the top corners down to the centre crease
3. Fold the bottom flap up on both sides
4. Open from the bottom and flatten into a square
5. Fold up the bottom corners again
6. Open again — you have a boat!

### Paper Chain 🔗
Cut strips of paper. Loop the first one, glue or tape it. Loop the next through the first. Repeat to make a colourful chain!

### Origami
**Origami** is the Japanese art of paper folding. You can make flowers, animals, and boxes — using just folding, no cutting or gluing!

### Activity 📄
Make a paper fan and decorate it with Zimbabwean patterns.`,
  },
  {
    title: "Dance and Movement",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "rGvUxtc2QUs", durationMinutes: 4,
    description: "Explore movement, rhythm, and expressive dance.",
    thumbnailUrl: "https://img.youtube.com/vi/rGvUxtc2QUs/hqdefault.jpg",
    milestone: "Sings & dances to rhythm",
    content: `## Dance and Movement 💃

Dance is a way of expressing feelings, telling stories, and celebrating. Every culture in the world has its own dances!

### Elements of Dance
| Element | Meaning |
|---------|---------|
| **Rhythm** | The beat we move to |
| **Space** | Where we move (up, down, sideways) |
| **Energy** | How we move (fast, slow, strong, gentle) |
| **Time** | How long we hold each move |
| **Flow** | How smoothly movements connect |

### Types of Movement
- Jump, hop, skip, leap
- Twist, turn, spin
- Bend, stretch, balance
- Stomp, tiptoe, creep

### Traditional Zimbabwean Dance 🇿🇼
Zimbabwe has many traditional dances:
- **Jerusarema/Mbende** — from Zezuru people, a UNESCO cultural heritage dance!
- **Shangara** — an energetic celebration dance
- **Muchongoyo** — from the Ndau people, celebrating victory

### Activity 💃
Choose a song you love. Make up 5 different dance moves to go with it. Practise until you can do them smoothly in order.`,
  },
  {
    title: "Rhythm and Beat — Reading Music",
    subject: "Visual & Performing Arts", classLevel: "ECD B",
    youtubeId: "HU_M4z7qnTc", durationMinutes: 4,
    description: "Learn about rhythm, beat, and the basics of reading music.",
    thumbnailUrl: "https://img.youtube.com/vi/HU_M4z7qnTc/hqdefault.jpg",
    milestone: "Sings & dances to rhythm",
    content: `## Rhythm and Beat 🎵

Music is built from **sound** and **silence**. Understanding rhythm makes you a better musician and dancer!

### Key Terms
| Term | Meaning |
|------|---------|
| **Beat** | The steady pulse of music (like a heartbeat) |
| **Rhythm** | The pattern of long and short sounds |
| **Tempo** | How fast or slow the music is |
| **Loud/Soft** | The volume (dynamics) |
| **Rest** | Silence in music |

### Clapping Rhythms
Try this 4-beat rhythm by clapping:
**LOUD – quiet – quiet – LOUD** (1 – 2 – 3 – 1)

Now try: **LOUD – LOUD – quiet – LOUD – quiet – quiet**

### Musical Notation Basics
- A **whole note** = 4 beats
- A **half note** = 2 beats
- A **quarter note** = 1 beat
- A **rest** = silence for that many beats

### Activity 👏
Work with a partner. One person claps a 4-beat rhythm. The other copies it exactly. Then switch!`,
  },
  {
    title: "Drawing Trees and Nature",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "zSnB1WMQt44", durationMinutes: 4,
    description: "Learn to draw trees, mountains and natural landscapes.",
    thumbnailUrl: "https://img.youtube.com/vi/zSnB1WMQt44/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Drawing Nature 🌳

Nature gives us endless inspiration for art!

### Drawing a Tree 🌳
1. Draw a **brown rectangle** for the trunk
2. Draw a **large round cloud shape** on top for the leaves
3. Add some branches peeking out
4. Draw roots at the base of the trunk
5. Colour: brown trunk, different shades of green for leaves

### Types of Trees to Draw
- **Mopane tree** — round canopy, common in Zimbabwe
- **Baobab** — huge thick trunk, short branches at top (looks upside down!)
- **Acacia** — flat-topped, like an umbrella
- **Msasa tree** — Zimbabwe's most common woodland tree, beautiful red leaves in spring

### Drawing Mountains ⛰️
1. Draw a large triangle — the mountain peak
2. Draw the triangle a bit jagged at the top
3. Add a snow cap (white triangle) at the very top
4. Add a horizon line at the base
5. Draw trees on the slopes

### Drawing the Sun and Sky 🌅
- Sunrise: orange, pink and yellow at the horizon
- Daytime: bright blue with white clouds
- Sunset: red, orange, purple

### Activity 🎨
Draw a Zimbabwean landscape with a baobab tree, mountains in the background, and a sunset sky.`,
  },
  {
    title: "Creating Art with Shapes",
    subject: "Visual & Performing Arts", classLevel: "ECD A",
    youtubeId: "KWtkoIkM_9c", durationMinutes: 4,
    description: "Use circles, squares, triangles and rectangles to create art.",
    thumbnailUrl: "https://img.youtube.com/vi/KWtkoIkM_9c/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Art Using Shapes 🔷

All art is made of shapes! Circles, squares, triangles and rectangles can combine to create anything.

### Build a Rocket 🚀
- 1 tall **rectangle** (body)
- 1 **triangle** on top (nose cone)
- 2 small **triangles** on the sides (fins)
- Circles at the bottom (flames) 🔴🟠🟡

### Build a Train 🚂
- Large **rectangles** for carriages
- **Circles** for wheels
- A **cylinder** shape (oval on its side) for the engine
- A small **square** for the driver's window

### Build a Robot 🤖
- **Square** head
- **Rectangle** body
- **Rectangle** arms and legs
- **Circle** eyes
- **Small rectangle** mouth

### Abstract Art
You can also arrange shapes without making a recognisable object — this is called **abstract art**! Cut out colourful shapes and arrange them to make patterns and designs.

### Activity 🎨
Using only shapes (no free-hand drawing), create a scene from Zimbabwe — maybe Hwange park with animals or a village scene.`,
  },
  {
    title: "Making Musical Instruments",
    subject: "Visual & Performing Arts", classLevel: "ECD B",
    youtubeId: "68ngmcKybys", durationMinutes: 5,
    description: "Make simple musical instruments at home using everyday materials.",
    thumbnailUrl: "https://img.youtube.com/vi/68ngmcKybys/hqdefault.jpg",
    milestone: "Sings & dances to rhythm",
    content: `## Make Your Own Instruments! 🎵

You can make musical instruments from everyday household materials!

### Shaker / Maraca 🥤
**Materials:** plastic bottle or tin, rice or small stones
1. Fill a small bottle or tin partway with rice or pebbles
2. Seal the top tightly
3. Decorate with paint or coloured paper
4. **Shake** to the beat! 🎶

### Drum 🥁
**Materials:** empty tin, pot, or wooden box; a stick
1. Use any hollow container (tin, box, pot)
2. Use a stick, pencil, or your hands to beat it
3. Different sizes make different sounds!

### String Instrument 🎸
**Materials:** a box with a hole, rubber bands
1. Cut a hole in a cardboard box
2. Stretch 4–6 rubber bands of different sizes across the hole
3. Pluck the bands — each makes a different note!

### Traditional Zimbabwean Instruments
- **Mbira** — thumb piano with metal keys
- **Ngoma** — drum
- **Chipendani** — mouth bow
- **Hosho** — a type of maraca made from dried gourds

### Activity 🎵
Make one instrument at home. Practise playing a simple rhythm with it.`,
  },
  {
    title: "Drawing Vehicles",
    subject: "Visual & Performing Arts", classLevel: "ECD B",
    youtubeId: "am1AhhVfqqc", durationMinutes: 5,
    description: "Draw cars, buses, aeroplanes and other vehicles step by step.",
    thumbnailUrl: "https://img.youtube.com/vi/am1AhhVfqqc/hqdefault.jpg",
    milestone: "Draws recognizable figures",
    content: `## Drawing Vehicles 🚗

Learning to draw vehicles is great practice for shapes and perspective!

### Drawing a Car 🚗
1. Draw a **large rectangle** for the body
2. Draw a **smaller rectangle** on top (cabin)
3. Add **2 large circles** at the bottom for wheels
4. Draw **arches** over the wheels (wheel wells)
5. Add **windows**, **headlights**, and **door handles**
6. Colour it!

### Drawing a Bus 🚌
1. Draw a very **wide rectangle** (body)
2. Add a **shorter rectangle** on top (roof)
3. Draw **4–6 squares** for windows along the side
4. Add **a large rectangle** for the door
5. Draw **4 circles** for wheels
6. Colour the bus and add route numbers!

### Drawing an Aeroplane ✈️
1. Draw an elongated oval (the fuselage)
2. Add **large triangle wings** on both sides
3. Draw a **smaller triangle** at the back (tail fin)
4. Add **oval windows** along the body
5. Draw **engine circles** under the wings

### Activity ✏️
Choose your favourite vehicle. Draw it carefully with all its details. Write 3 sentences describing it.`,
  },

  // ── HERITAGE STUDIES ──────────────────────────────────────────────────
  {
    title: "Zimbabwe's Flag and National Symbols",
    subject: "Heritage Studies", classLevel: "ECD A",
    youtubeId: "wN2HRneQIac", durationMinutes: 4,
    description: "Learn about Zimbabwe's national flag and what its symbols mean.",
    thumbnailUrl: "https://img.youtube.com/vi/wN2HRneQIac/hqdefault.jpg",
    milestone: null,
    content: `## Our National Symbols 🇿🇼

### The Zimbabwe Flag 🇿🇼
The flag has **7 stripes** and a white triangle on the left.

| Colour | Meaning |
|--------|---------|
| 🟢 Green | Agriculture and the green land |
| 🟡 Yellow | Zimbabwe's mineral wealth (gold) |
| 🔴 Red | The blood of those who fought for freedom |
| ⚫ Black | The heritage of black Zimbabweans |
| ⚪ White (triangle) | Peace |

The **Zimbabwe Bird** (a carved soapstone bird) is on the flag — it represents the Great Zimbabwe ruins. The **Red Star** represents hope for the future.

### National Symbols
- 🦅 **National Bird:** African Fish Eagle (*hungwe*)
- 🌺 **National Flower:** Flame Lily (*chitungu*)
- 🗿 **National Motto:** "Unity, Freedom, Work" (*Urwisai, Rusununguko, Basa*)

### National Anthem
*"Blessed be the land of Zimbabwe…"*
We sing the national anthem with pride at school and national events.

### Activity ✏️
Draw and colour the Zimbabwe flag correctly. Write the meaning of each colour below your drawing.`,
  },
  {
    title: "Traditional Zimbabwean Food and Cooking",
    subject: "Heritage Studies", classLevel: "ECD A",
    youtubeId: "9a6C5rvS56A", durationMinutes: 4,
    description: "Discover the traditional foods of Zimbabwe and how they are prepared.",
    thumbnailUrl: "https://img.youtube.com/vi/9a6C5rvS56A/hqdefault.jpg",
    milestone: null,
    content: `## Traditional Zimbabwean Food 🍽️

Zimbabwe has a rich food culture rooted in farming and community.

### The Main Foods

**Sadza 🍚**
Sadza is Zimbabwe's national dish. It is thick, stiff porridge made from maize meal (flour). Zimbabweans eat sadza at almost every meal, usually with relish.

**Nyama (Meat) 🥩**
Beef, chicken, goat, and game meat are common. Meat is often grilled, roasted, or stewed.

**Muriwo (Vegetables) 🥬**
Pumpkin leaves (*machakada*), rape, and covo are popular. They are cooked with onion and tomato.

**Dovi (Peanut Butter Stew) 🥜**
A rich, tasty stew made with chicken and peanut butter. Very popular!

**Matemba (Dried Fish)**
Small dried fish cooked as relish with vegetables.

### Special Occasion Foods
- **Mupunga** (rice) — cooked for celebrations
- **Mahewu** — a thick, fermented drink made from maize
- **Bota** — soft porridge for breakfast

### Activity 🍽️
Ask a parent or grandparent to tell you their favourite traditional Zimbabwean recipe. Write it down and draw the food.`,
  },
  {
    title: "Traditional African Games and Play",
    subject: "Heritage Studies", classLevel: "ECD A",
    youtubeId: "6F416m-Z4f8", durationMinutes: 3,
    description: "Learn about traditional games children play in Zimbabwe and across Africa.",
    thumbnailUrl: "https://img.youtube.com/vi/6F416m-Z4f8/hqdefault.jpg",
    milestone: null,
    content: `## Traditional African Games 🎮

Long before computers and phones, children played wonderful traditional games. Many of these games are still played today!

### Popular Zimbabwean Children's Games

**Nhodo / Tsoro (Mancala)**
A counting and strategy game played with small stones and holes dug in the earth. Two players take turns moving stones around the board to capture their opponent's pieces.

**Nhova (Conkers / Stone Game)**
Players throw stones or seeds trying to knock each other's stone.

**Dare (Storytelling Circle)**
Children sit in a circle around a fire or under a tree. Elders tell stories while children listen and respond.

**Jumping Rope 🪢**
Children take turns jumping while others swing a long rope. Songs are sung in rhythm with the jumping.

**Kuda (Hide and Seek)**
One child closes their eyes and counts while others hide. The seeker calls "Kuda?" (Where are you?) and listens!

### Why Traditional Games Matter
They teach: counting, strategy, teamwork, patience, and respect for elders.

### Activity 🎮
Teach a traditional game to your family or friends. Play it together!`,
  },
  {
    title: "Our Community and Family Life",
    subject: "Heritage Studies", classLevel: "ECD A",
    youtubeId: "gIk7ppDMKRg", durationMinutes: 3,
    description: "Learn about the importance of family and community in Zimbabwean culture.",
    thumbnailUrl: "https://img.youtube.com/vi/gIk7ppDMKRg/hqdefault.jpg",
    milestone: null,
    content: `## Mhuri — Family and Community 👨‍👩‍👧‍👦

In Zimbabwean culture, **family and community** are everything. The Shona word **ubuntu** (or *unhu* in Shona) means "I am because we are" — we are all connected.

### The Extended Family
Zimbabweans often live with or near their extended family:
- **Parents** (*Baba* and *Amai*)
- **Grandparents** (*Sekuru* and *Ambuya*)
- **Aunts and Uncles** (*Tete* and *Sekuru*)
- **Cousins** — treated like brothers and sisters

### The Village (Musha)
Many Zimbabweans have a home village (*musha*). Families return there for celebrations, funerals, and the farming season.

### Community Values
- **Respect for elders:** Always greet with both hands
- **Ubuntu/Unhu:** Help neighbours without being asked
- **Kutendera:** Showing gratitude and appreciation
- **Dare:** Community meetings where everyone has a voice

### Family Roles
Traditionally:
- Fathers provide and protect
- Mothers nurture and manage the home
- Children help with chores and school
- Elders share wisdom

### Activity ✏️
Draw your family. Write each person's name and their role in the family.`,
  },
  {
    title: "Victoria Falls — The Smoke That Thunders",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "spNQAaTzMRU", durationMinutes: 5,
    description: "Discover one of Africa's greatest wonders — Victoria Falls.",
    thumbnailUrl: "https://img.youtube.com/vi/spNQAaTzMRU/hqdefault.jpg",
    milestone: null,
    content: `## Victoria Falls — Mosi-oa-Tunya 💦

**Victoria Falls** is one of the Seven Natural Wonders of the World. It is located on the Zambezi River, on the border between Zimbabwe and Zambia.

### Amazing Facts
| Fact | Detail |
|------|--------|
| 📍 Location | Zambezi River, Zimbabwe/Zambia border |
| 📏 Width | 1.7 km — wider than any other waterfall |
| 📐 Height | 108 metres (taller than a 35-storey building!) |
| 💦 Water flow | Up to 500,000 litres per second in flood season |
| 🌈 Feature | A permanent rainbow can be seen in the mist |

### The African Name
The local Kololo people called it **Mosi-oa-Tunya** — "The Smoke That Thunders." When you stand near it, the roar is so loud and the mist so thick it looks like smoke rising!

### History
Scottish explorer **David Livingstone** was the first European to see the falls in 1855. He named it after Queen Victoria of Britain. But Africans knew and named it centuries before!

### It's a UNESCO World Heritage Site
Victoria Falls is protected as a world heritage site because of its outstanding natural beauty.

### Activity ✏️
Draw Victoria Falls with the mist and rainbow. Write 3 facts you remember below.`,
  },
  {
    title: "African Oral Tradition — Storytelling",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "efbdtdlYiM0", durationMinutes: 4,
    description: "Learn about Africa's rich tradition of passing down knowledge through storytelling.",
    thumbnailUrl: "https://img.youtube.com/vi/efbdtdlYiM0/hqdefault.jpg",
    milestone: null,
    content: `## Oral Tradition — Stories Keep History Alive 📖

Long before books existed, African communities kept their history, values and wisdom alive through **oral tradition** — passing stories, proverbs, and songs from mouth to ear, generation to generation.

### What is Oral Tradition?
**Oral tradition** is the way communities share knowledge without writing it down:
- Stories and folktales
- Proverbs and wise sayings
- Songs and chants
- Poetry
- Historical accounts told aloud

### The Role of the Storyteller
In Zimbabwe, storytelling traditionally happened at **dare** (community gatherings) or around the **fire** at night. Elders were the keepers of history.

The storyteller begins: *"Nganyana, nganyana!"* (Once upon a time!)
The listeners respond: *"Nganyana!"* (Tell us!)

### Why Stories Matter
Stories teach children:
- Right from wrong (moral lessons)
- How to be brave, kind, and wise
- About their ancestors and history
- About the world of animals and nature

### Famous African Storytelling Characters
- **Hare** — the clever trickster
- **Tortoise** — slow but wise
- **Elephant** — powerful but sometimes foolish
- **Spider (Anansi)** — the greatest trickster of all

### Activity ✏️
Ask an elder or parent to tell you a traditional story. Write down the main character, what happened, and the lesson at the end.`,
  },
  {
    title: "Ancient African Kingdoms",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "WhytqHqc63I", durationMinutes: 5,
    description: "Discover the great African kingdoms and empires of ancient times.",
    thumbnailUrl: "https://img.youtube.com/vi/WhytqHqc63I/hqdefault.jpg",
    milestone: null,
    content: `## Ancient African Kingdoms 🏛️

Africa has a long, proud history of powerful kingdoms and empires — long before Europeans arrived!

### Great Zimbabwe Kingdom (1100–1450 AD)
The Great Zimbabwe kingdom controlled **gold trade** between central Africa and the East African coast. The king ruled from the great stone city. Merchants from Arabia, China, and India traded here!

### Kingdom of Mutapa (1430–1760 AD)
After Great Zimbabwe, the Mutapa Kingdom controlled much of modern Zimbabwe and Mozambique. The ruler was called **Mutapa** (meaning "master pillager" or "lord of plundered lands").

### Other Great African Kingdoms
| Kingdom | Location |
|---------|----------|
| Kingdom of Mali | West Africa |
| Kingdom of Kush | Sudan/Ethiopia |
| Egyptian Pharaohs | North Africa |
| Kingdom of Benin | Nigeria |
| Zulu Kingdom | South Africa |

### What Made Kingdoms Great?
- Fertile land for farming
- Control of trade routes (gold, ivory, salt)
- Strong military
- Skilled craftsmen

### Activity ✏️
Draw a map of Africa. Mark Zimbabwe and two other ancient kingdoms on it.`,
  },
  {
    title: "Traditional African Clothing and Dress",
    subject: "Heritage Studies", classLevel: "ECD A",
    youtubeId: "SbmUMPt2h_o", durationMinutes: 3,
    description: "Learn about the colourful traditional clothing of Zimbabwe and Africa.",
    thumbnailUrl: "https://img.youtube.com/vi/SbmUMPt2h_o/hqdefault.jpg",
    milestone: null,
    content: `## Traditional Clothing of Zimbabwe 👘

Different African communities have their own beautiful traditional clothing, worn especially at celebrations and ceremonies.

### Shona Traditional Dress
- **Women** wear colourful wraps called *mapfeka* (fabric wrapped around the body), often with matching headwraps
- **Men** wear loincloths made of animal skin (*nhembe*) for traditional ceremonies
- **Dancing outfits** include feathered headdresses, bead necklaces, and ankle rattles

### Ndebele Traditional Dress
The Ndebele people (south of Zimbabwe) are famous for their extremely colourful clothing and beaded designs. Women wear:
- Brightly painted walls matching their clothing
- Stacked bead rings around arms and necks
- Aprons (*mapoto*) with bold geometric patterns

### African Print Fabric 🌺
**Chitenge** (or Ankara) fabric is a colourful printed cotton cloth worn across Africa. Every pattern has a name and meaning!

### When Traditional Dress Is Worn
- **Funerals** — sombre colours
- **Weddings** — bright and celebratory
- **Independence Day** — national colours
- **Cultural festivals** — full traditional dress

### Activity 🎨
Design your own traditional pattern on paper. Use geometric shapes and bright colours.`,
  },
  {
    title: "Heroes of Zimbabwe",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "nvPhYnjh9JI", durationMinutes: 5,
    description: "Learn about the brave men and women who shaped Zimbabwe's history.",
    thumbnailUrl: "https://img.youtube.com/vi/nvPhYnjh9JI/hqdefault.jpg",
    milestone: null,
    content: `## Zimbabwe's Heroes 🦸

Zimbabwe has many brave people who fought for freedom and justice. We honour them at **Heroes Acre** in Harare and on **Heroes Day** (August 11).

### National Heroes

**Mbuya Nehanda (Charwe Nyakasikana)**
A spiritual leader and *svikiro* (medium) who led the First Chimurenga uprising against colonial rule in 1896–1897. Her last words before execution were: *"My bones will rise."* She became a symbol of resistance.

**Sekuru Kaguvi**
He fought alongside Mbuya Nehanda in the First Chimurenga. He was also executed in 1898.

**Robert Mugabe (1924–2019)**
Zimbabwe's first Prime Minister and second President. Led the fight for independence which was achieved on **18 April 1980**.

**Joshua Nkomo (1917–1999)**
Known as "Father Zimbabwe," he was a key leader in the independence struggle.

### Zimbabwe's Independence — 18 April 1980 🇿🇼
After years of struggle, Zimbabwe became an independent nation on this day. It is celebrated every year as **Independence Day**!

### Activity ✏️
Write 3 sentences about Mbuya Nehanda — who she was, what she did, and why she matters today.`,
  },
  {
    title: "African Art — Patterns and Symbols",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "bw_Q_zJdeuQ", durationMinutes: 4,
    description: "Explore the patterns and symbols in traditional African art.",
    thumbnailUrl: "https://img.youtube.com/vi/bw_Q_zJdeuQ/hqdefault.jpg",
    milestone: null,
    content: `## African Art — Patterns and Meaning 🎨

African art is one of the world's oldest art traditions. Every pattern, colour, and shape can carry meaning.

### Types of African Art
- **Rock paintings** — ancient paintings on cave walls (Zimbabwe has thousands!)
- **Pottery and clay work** — pots, bowls, and figures
- **Basket weaving** — patterns woven into baskets
- **Beadwork** — intricate patterns in jewellery
- **Wood carving** — masks, figures, drums, musical instruments
- **Fabric printing** — bold geometric designs

### Common Patterns in Zimbabwean Art
- **Triangles and diamonds** — represent mountains and water
- **Spirals** — represent life cycles and eternity
- **Chevrons (zigzags)** — represent lightning or ancestors
- **Circles** — represent the sun, community, wholeness

### Zimbabwe's Stone Sculpture
Zimbabwe is famous worldwide for its **stone sculpture** — particularly *verdite* and *serpentine* stone carvings. Artists carve people, animals, and spiritual figures.

### Activity 🎨
Using geometric shapes (triangles, diamonds, circles, zigzags), create your own traditional-style African pattern. Use bold, bright colours.`,
  },
  {
    title: "Zimbabwe's Geography — Rivers, Mountains and Wildlife",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "JAXlOOO1i20", durationMinutes: 5,
    description: "Explore Zimbabwe's beautiful geography, major rivers, mountains and national parks.",
    thumbnailUrl: "https://img.youtube.com/vi/JAXlOOO1i20/hqdefault.jpg",
    milestone: null,
    content: `## Zimbabwe's Beautiful Land 🗺️

Zimbabwe is a landlocked country in southern Africa. It has stunning geography — from mountains to valleys, rivers to waterfalls!

### Major Rivers
| River | Shona name | Feature |
|-------|-----------|---------|
| **Zambezi** | Zambezi | Zimbabwe's northern border; home to Victoria Falls |
| **Limpopo** | — | Southern border with South Africa |
| **Save** | Save | Flows east to Mozambique |
| **Mazowe** | Mazowe | Flows through Mashonaland |

### Mountains and Highlands
- **Eastern Highlands** — the most scenic region, with tea and coffee farms
- **Nyangani** — Zimbabwe's highest mountain (2,592 m)
- **Chimanimani** — dramatic rocky mountains on the Mozambique border

### Major Cities
🏙️ **Harare** (capital) · **Bulawayo** · **Mutare** · **Gweru** · **Masvingo**

### National Parks and Wildlife
Zimbabwe has some of Africa's best wildlife parks:
- **Hwange National Park** — thousands of elephants 🐘
- **Gonarezhou** — the "Place of Many Elephants"
- **Mana Pools** — UNESCO World Heritage, on the Zambezi River
- **Matobo Hills** — ancient rock art and black & white rhinos

### Activity 🗺️
Draw a simple map of Zimbabwe. Mark Harare, the Zambezi River, Victoria Falls, and Hwange.`,
  },
  {
    title: "African Proverbs and Wisdom",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "b4vfsheySAA", durationMinutes: 4,
    description: "Explore the wisdom of African proverbs from Zimbabwe and across the continent.",
    thumbnailUrl: "https://img.youtube.com/vi/b4vfsheySAA/hqdefault.jpg",
    milestone: null,
    content: `## African Proverbs — The Wisdom of Our Elders 💬

A **proverb** is a short, wise saying that carries an important lesson. African proverbs are some of the wisest words ever spoken!

### Famous African Proverbs

🌍 **"It takes a village to raise a child."**
*Meaning: Children need many people — family, neighbours, teachers — to grow well.*

🐢 **"Slowly, slowly catches the monkey."** *(Swahili)*
*Meaning: Patience and persistence will get you what you want.*

🌊 **"When the music changes, so does the dance."** *(Nigerian)*
*Meaning: Be flexible and adapt when things change.*

🌳 **"A tree is straightened while it is young."** *(African)*
*Meaning: Children should be taught good values from a young age.*

🦁 **"Until the lion has his own storyteller, the hunter will always be the hero."** *(African)*
*Meaning: Everyone needs to tell their own story — history belongs to those who live it.*

### Zimbabwe-Specific Proverbs (Tsumo)
- *Chara chimwe hachitswanyi inda.* — One finger can't crush a louse. (Unity!)
- *Kudzidza hakuperi.* — Learning never ends.

### Activity ✏️
Choose your favourite proverb from this list. Write it out. Draw a picture that shows its meaning. Explain it to a family member.`,
  },
  {
    title: "African Cultures and Diversity",
    subject: "Heritage Studies", classLevel: "ECD B",
    youtubeId: "rGvUxtc2QUs", durationMinutes: 4,
    description: "Celebrate the diversity of Africa's many cultures, languages and peoples.",
    thumbnailUrl: "https://img.youtube.com/vi/rGvUxtc2QUs/hqdefault.jpg",
    milestone: null,
    content: `## Africa's Rich Diversity 🌍

Africa is the world's **second largest continent**. It has **54 countries**, over **2,000 languages**, and thousands of distinct cultural groups!

### Zimbabwe's Own Diversity
Zimbabwe has **16 official languages** including:
- **Shona** (spoken by ~70% of people)
- **Ndebele/Sindebele** (spoken by ~20%)
- **Kalanga**, **Tonga**, **Nambya**, **Venda** and others

### Different Groups in Zimbabwe
| Group | Region | Known for |
|-------|--------|-----------|
| **Shona** | Most of Zimbabwe | Great Zimbabwe, mbira, oral tradition |
| **Ndebele** | Matabeleland | Beadwork, cattle culture, Mzilikazi |
| **Tonga** | Zambezi Valley | Lake Kariba, traditional fishing |
| **Shangaan** | South-east | Traditional dance (Muchongoyo) |

### The Beauty of Diversity
Different groups have different foods, dances, languages, and customs. But all Zimbabweans share:
- Love of family and community
- Respect for elders
- Pride in the land
- Ubuntu — caring for each other

### Activity ✏️
Write 3 things that are unique to YOUR family's culture or community. Share with a classmate — what do you have in common? What is different?`,
  },
] as const;

export async function ensureLessons(): Promise<void> {
  const existingTitles = new Set(
    (await db.select({ title: lessonsTable.title }).from(lessonsTable)).map((r) => r.title)
  );

  const toInsert = (EXTRA_LESSONS as unknown as typeof EXTRA_LESSONS[number][]).filter(
    (l) => !existingTitles.has(l.title)
  );

  if (toInsert.length === 0) return;

  for (let i = 0; i < toInsert.length; i += 10) {
    await db.insert(lessonsTable).values(toInsert.slice(i, i + 10) as any[]);
  }

  console.log(`Seed: inserted ${toInsert.length} extra lessons`);
}
