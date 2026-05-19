import { db, storiesTable } from "@workspace/db";
import { count } from "drizzle-orm";

const STORIES = [
  {
    title: "The Clever Hare and the Lion",
    emoji: "🐇",
    classLevel: "ECD A",
    summary: "When greedy Lion claims all the water for himself, tiny Hare uses quick thinking to save every animal in the village.",
    body: `Long ago, by the great Limpopo River, all the animals shared one big watering hole.

Every day, Lion came to drink. He was big. He was loud. And he was very greedy.

"This water is **MINE!**" roared Lion. "No one else may drink!"

The zebras were thirsty. The elephants were thirsty. Even the little birds were thirsty. But everyone was too frightened to say anything.

Everyone except Hare.

Hare was small. Hare was quick. And Hare had a plan.

The next morning, Hare arrived at the watering hole before Lion. He dug a small hole in the mud and hid himself inside, leaving only his long ears sticking out.

When Lion arrived, he stopped. He stared at the two mysterious things poking out of the mud.

"What is that?" Lion growled.

"Oh," said Hare in a deep, rumbling voice from underground, "that is the Great Underground Lion. He is **much** bigger than you. And he says this water belongs to ALL the animals!"

Lion stared at the two ears. He thought about a lion bigger than himself. His knees began to shake.

"I… I was just leaving," said Lion — and he ran away and never came back.

The animals laughed and drank and splashed happily.

And little Hare stood up, shook the mud from his ears, and smiled.`,
    moral: "A clever mind can solve what strength cannot.",
    readMinutes: 3,
  },
  {
    title: "How the Zebra Got Its Stripes",
    emoji: "🦓",
    classLevel: "ECD A",
    summary: "A long time ago, Zebra was pure white all over. Find out the funny story of how Zebra got its famous black stripes!",
    body: `A long, long time ago, when the world was still new, Zebra was completely white — white as clouds, white as fresh milk.

One day, Zebra was playing near the fire where old Baboon was cooking his lunch.

"Move away!" grumbled Baboon. "You will knock over my fire!"

But Zebra kept dancing and spinning — and **CRASH!** — he stumbled right into the fire!

Zebra jumped and leaped and jumped again, kicking burning sticks in every direction.

When he finally stopped, he looked down at himself. Black stripes ran all across his white coat where the burning sticks had touched him.

Zebra began to cry.

But then his friend Wildebeest came running. "Those stripes are *beautiful!*" she said.

"Really?" sniffled Zebra.

"Yes! No other animal in the whole savanna has markings like yours. You are one of a kind!"

Zebra looked at his reflection in the river. He turned this way. He turned that way. A slow smile spread across his face.

From that day, Zebra wore his stripes with pride.

And if you look carefully, you will see that no two zebras have exactly the same stripes — just like no two people are exactly the same either.`,
    moral: "What makes you different makes you special.",
    readMinutes: 3,
  },
  {
    title: "Tendai Shares the Mangoes",
    emoji: "🥭",
    classLevel: "ECD A",
    summary: "Tendai finds a mango tree bursting with ripe fruit and decides not to share — until something surprising changes his mind.",
    body: `Tendai lived in a small village near Harare. Behind his house stood the most wonderful mango tree you ever saw.

One hot afternoon, Tendai found the tree covered in ripe, juicy mangoes. He filled his basket until it was overflowing.

"I will not share these," Tendai said to himself. "These mangoes are **all mine.**"

He sat under the tree and bit into one. Sweet. Delicious. He ate another. And another.

But then he looked up. His little sister Rudo stood at the gate, watching him with big, quiet eyes.

He looked away.

Then his neighbour's baby began to cry. Then old Ambuya from next door walked past, slow and tired from the market.

Tendai's mango suddenly did not taste so sweet anymore.

He sat very still. He thought.

Then he stood up.

"Rudo! Come and eat! Ambuya, please take some! Bring the baby!"

Soon children were climbing the branches, Ambuya was laughing so hard she nearly dropped her mango, and the baby was covered head to toe in mango juice, giggling like anything.

Tendai took another bite.

This time it was the sweetest mango he had ever tasted in his life.

"Food always tastes better when you share it," said Ambuya, wiping her chin.

Tendai smiled and threw a mango up to the child in the highest branch.

"I know," he said. "I know."`,
    moral: "Sharing makes the sweet things even sweeter.",
    readMinutes: 3,
  },
  {
    title: "The Greedy Crocodile",
    emoji: "🐊",
    classLevel: "ECD B",
    summary: "Crocodile wants the whole Zambezi River to himself — but discovers that greed can cost you everything you already have.",
    body: `In the wide, shining Zambezi River, there lived a crocodile named Gava.

Gava was not happy with just his stretch of the river. He wanted it **all.**

First he chased away the fish. "All the fish are mine!"

Then he frightened off the hippos. "All the space is mine!"

Then he scared the water birds from the reeds. "Everything here is mine!"

Soon, Gava had the whole river to himself. He smiled his long, toothy smile.

But then strange things began to happen.

Without the fish, the river filled up with too many insects. They buzzed around Gava day and night and gave him no rest.

Without the hippos, the reeds grew thick and tangled and blocked the cool channels Gava loved to float in.

Without the water birds, there was nobody to call out a warning when danger came near.

One quiet morning, hunters crept along the bank. No bird cried out. No hippo splashed to scare them away.

Gava only just escaped by diving deep and swimming far away.

He sat alone on a muddy bank, itchy from insects, tangled in weeds, and very frightened.

"I had everything," he said quietly, "and I chased it all away."

Slowly, Gava swam back. He said sorry to the fish. He said sorry to the hippos. He said sorry to the birds.

It took time. But slowly, one by one, they all came back.

And Gava, for the first time in a long while, felt truly at home.`,
    moral: "Greed can cost you everything you already have.",
    readMinutes: 4,
  },
  {
    title: "Shumba the Brave Little Lion",
    emoji: "🦁",
    classLevel: "ECD A",
    summary: "Shumba the lion cub has a secret — he is afraid of the dark. But one night, a tiny friend needs his help.",
    body: `Shumba was a lion cub, and everyone knew that lions were supposed to be brave.

But Shumba had a secret.

He was afraid of the dark.

Every evening when the sun went down, Shumba pressed close to his mother and squeezed his eyes shut.

"Lions are not afraid," he told himself over and over. But his heart still beat very fast.

One night, Shumba heard a tiny cry from outside the den.

It was Pika the mouse — and she was lost in the dark.

"Help!" cried Pika in her small voice. "I cannot find my way home!"

Shumba's heart banged hard. He looked at the darkness outside. The darkness looked back at him.

He thought about Pika — so small, so frightened, all alone.

Slowly, one paw at a time, Shumba stepped out of the den.

The dark was all around him. His legs felt wobbly. But he called out:

"Pika! Follow my voice! I am here!"

He kept calling, and Pika followed the sound through the grass and the shadows until she found him. Together they walked all the way to her home in the roots of the big acacia tree.

"You saved me!" said Pika. "You are so brave!"

"I was scared," Shumba admitted.

"I know," said Pika gently. "That is exactly what makes it brave."

Shumba padded back to the den. The dark was still dark.

But somehow, it did not feel quite so large anymore.`,
    moral: "Bravery is not about feeling no fear — it is about helping others even when you do.",
    readMinutes: 3,
  },
  {
    title: "Rudo and the Little Lost Bird",
    emoji: "🐦",
    classLevel: "ECD A",
    summary: "Rudo is having a very bad, grumpy morning — until she finds a tiny injured bird that needs her care.",
    body: `Rudo had been sad all morning.

Her favourite toy was broken. Her porridge had lumps. The rain kept her stuck inside.

She sat by the window and frowned at the grey sky.

Then she heard something — a tiny cheeping sound, barely louder than a whisper.

She pressed her nose to the glass. There, under the jacaranda tree, a small bird lay in the wet grass. It had a hurt wing and could not fly.

Rudo forgot all about being grumpy.

She ran to her mother. "Mama! Come quickly!"

Together they brought the little bird inside. They made it a cosy nest from a small box and soft cloth. They gave it tiny drops of water from a teaspoon. They named it **Nyeredzi** — which means "little star" in Shona.

For three days, Rudo woke up early to check on Nyeredzi. She spoke to it softly. She sang it the songs her grandmother had taught her.

On the fourth morning, Nyeredzi stood up on two strong little legs and chirped loudly.

That afternoon, Rudo opened the window.

Nyeredzi looked at her. It chirped once — and flew up into the blue, clear sky.

Rudo watched until the little bird disappeared over the rooftops.

"Are you sad it's gone?" asked her mother.

Rudo thought about it. Then she slowly shook her head.

"No," she said. "I feel happy."

And she really, truly did.`,
    moral: "Caring for someone else can heal your own sad heart too.",
    readMinutes: 3,
  },
  {
    title: "The Tortoise Who Raced the Wind",
    emoji: "🐢",
    classLevel: "ECD B",
    summary: "Everyone laughs when slow old Kamba the tortoise agrees to race the Wind itself. But Kamba has a secret weapon.",
    body: `Kamba the tortoise was famous across the savanna for one thing: being slow.

One dry season, the Wind came sweeping across the plains, spinning dust and scattering leaves everywhere it went.

"Ha!" laughed Wind, swirling around Kamba. "You are the slowest creature alive! I could race to the great mountain and back before you lift one foot!"

All the animals gathered to watch.

"I will race you," said Kamba, quietly tucking in his legs to wait out the dust.

The animals burst out laughing. The Wind roared with amusement.

"Very well! We race to the mountain and back. Tomorrow at sunrise!"

That night, while everyone slept, Kamba did not rest. Steadily, one step after the other, he began walking toward the mountain.

At sunrise, Wind whooshed away from the starting line like a thunderclap. It reached the mountain in moments and came screaming back.

But on the return journey, Wind got distracted. It chased a dust devil across a dry field. It played in the tall grass and made it dance. It whipped across the lake and made great waves.

When Wind finally rushed back to the finish — Kamba was already sitting in the shade, calm and still.

"How?!" Wind sputtered, spinning in confused circles.

Kamba looked up slowly. "You are much faster than me," he said. "But I never stopped."`,
    moral: "Patience and steady effort will take you further than speed alone.",
    readMinutes: 4,
  },
  {
    title: "Why the Moon Has a Face",
    emoji: "🌙",
    classLevel: "ECD B",
    summary: "A Zimbabwean legend about the night the Moon decided to stop shining — and the old grandmother who called it back.",
    body: `Long ago, when the sky was still being made, the Great Spirit gave the Sun and the Moon each a job.

"Sun," said the Great Spirit, "you will warm the earth and wake up every new day."

"Moon," said the Great Spirit, "you will light the night and watch over those who sleep."

Sun set to work without hesitation, blazing bright and rising faithfully every morning. The people danced in its warmth. They grew crops in its light. They praised the Sun in songs.

Nobody praised the Moon.

Night after night, Moon shone alone in the dark while the world slept. No one said thank you. No one danced for Moon.

One night, Moon decided to stop working.

"Why should I shine if nobody notices?" And Moon hid behind thick clouds.

That night was the darkest the world had ever known. Children whimpered in their sleep. Night animals bumped into each other. The stars looked very small and lonely.

An old grandmother lit a candle and sat outside. She looked up at the heavy dark sky.

"Moon," she called softly, "we may be asleep when you do your work. But we sleep *peacefully* because of your light. We are never afraid of the night because you are there. We notice. We are grateful."

Slowly, Moon peeked out from behind the clouds.

The grandmother smiled up at it warmly.

From that night, Moon has always shone faithfully over the sleeping world. And if you look up on a clear night, you can still see Moon's face — watching over you while you sleep.`,
    moral: "Quiet, faithful work is always noticed by someone who matters.",
    readMinutes: 4,
  },
];

export async function ensureStories(): Promise<void> {
  const [{ value }] = await db.select({ value: count() }).from(storiesTable);
  if (value > 0) return;

  await db.insert(storiesTable).values(STORIES);
  console.log(`Seed: inserted ${STORIES.length} stories`);
}
