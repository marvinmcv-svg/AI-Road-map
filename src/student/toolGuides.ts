// Step-by-step guides for every tool in the course, written for total beginners.
// Student-safe: shown on the student site AND linked from teacher lesson pages.
// Keep words short and plain. Apps change their buttons often, so steps say
// "look for" and give a plan if the button has moved.

export interface ToolGuide {
  id: string;
  name: string;
  icon: string;
  color: string;
  oneLiner: string; // what it is, in one line
  likeA: string; // an everyday comparison
  usedIn: string; // which quests
  cost: string;
  account: string;
  url?: string;
  setup: string[]; // first-time steps
  firstTry?: { label: string; prompt: string };
  tips: string[];
  stuck: [string, string][]; // [problem, fix]
  safety: string[];
  /** words in a mission or lesson that mean "this tool is used here" */
  match: RegExp;
}

export const GUIDES: ToolGuide[] = [
  {
    id: 'gemini',
    name: 'Gemini (chat)',
    icon: '💎',
    color: '#4f7cff',
    oneLiner: "Google's AI helper. You type (or talk), and it answers, explains and makes ideas.",
    likeA: 'A smart study buddy who never gets tired of questions.',
    usedIn: 'Quest 0 to Quest 2 (and for pictures later)',
    cost: 'Free with daily limits. Paid Google AI plans (and student deals) give more.',
    account: 'Use your own Google account. Some parts (like video) need you to be 18 or older.',
    url: 'https://gemini.google.com',
    setup: [
      'Go to gemini.google.com (or get the Gemini app on your phone).',
      'Sign in with your Google account.',
      'Find the box at the bottom that says something like "Ask Gemini".',
      'Type a question and press Enter. That is a prompt!',
      'Use "New chat" when you start a new topic, so old ideas don\'t mix in.'
    ],
    firstTry: {
      label: 'Your first prompt',
      prompt:
        'You are a friendly coach. Explain what AI is in 3 short sentences, like I am new to it. Then ask me one question to check I got it.'
    },
    tips: [
      'Use the Prompt Recipe: Role, Task, Details, Style, Format.',
      'Not happy? Don\'t start over. Say what to change: "Shorter." "Make it funnier." "Use a table."',
      'Tap the mic to talk instead of type.',
      'Ask "How sure are you?" and "Where can I check this?" for facts.'
    ],
    stuck: [
      ['It says I hit a limit.', 'Free plans have daily limits. Wait until tomorrow, or plan your best prompts first so you don\'t waste tries.'],
      ['The answer is wrong or made up.', 'That is a hallucination. Check 2 trusted places. Tell Gemini what is wrong and ask again.'],
      ["I can't find a button from the lesson.", 'Apps change a lot. Look in the ☰ menu or the + / tools button next to the chat box. Or just ask Gemini: "How do I ___ in Gemini?"'],
      ['It won\'t answer my question.', 'It may think it is unsafe. Say it more clearly, or ask your teacher.']
    ],
    safety: ['No full names, home address, school name or passwords.', 'Check facts before you share them.'],
    match: /\bGemini\b(?! (with Veo|image|pictures|API))/
  },
  {
    id: 'gemini-images',
    name: 'Gemini pictures (Nano Banana)',
    icon: '🍌',
    color: '#ffb800',
    oneLiner: 'Gemini can make and edit pictures from your words.',
    likeA: 'An artist who paints whatever you describe, in seconds.',
    usedIn: 'Quest 1 (Images), plus icons and art in Quests 3 to 6',
    cost: 'Free with a daily picture limit. Paid plans give more.',
    account: 'Your own Google account.',
    url: 'https://gemini.google.com',
    setup: [
      'Open gemini.google.com and sign in.',
      'Start your prompt with "Make a picture of…" (or pick the picture / 🍌 tool if you see one).',
      'Use the Image Prompt Formula: Subject, Setting, Style, Camera, Light, Shape.',
      'When the picture comes, ask for ONE change at a time: "Make the sky purple."',
      'Tap the picture, then the download button, to save it. Give it a short file name like logo.png.'
    ],
    firstTry: {
      label: 'Your first picture',
      prompt:
        'Make a picture of a small robot watering a plant on a windowsill, at sunset, warm golden light, cute 3D clay style, close-up, square 1:1.'
    },
    tips: [
      'Say the shape: square 1:1 for posts, tall 9:16 for phones, wide 16:9 for slides.',
      'Words on pictures: put the exact words in "quotes" and keep them short.',
      'Keep a style the same: save your best prompt and reuse the style part every time.',
      'You can upload a photo of an OBJECT (like a cup) and ask Gemini to change the background.'
    ],
    stuck: [
      ['Hands, letters or faces look weird.', 'Ask: "Fix the hands" or "Make the words say exactly: ___". Or try again with a simpler picture.'],
      ['It made the wrong thing.', 'Add more details: what, where, style, camera. Short prompts give random pictures.'],
      ['It won\'t make my picture.', 'Real people, brands and famous characters are often blocked. Make up your own!'],
      ['I ran out of pictures today.', 'Plan prompts in a doc first. Try again tomorrow.']
    ],
    safety: ['Never edit photos of real people without a "yes" from them. Never classmates.', 'No real brands or copied characters.', 'Say #MadeWithAI when you share.'],
    match: /Gemini (image|pictures)|Nano Banana|\bimage prompt|Make a picture/i
  },
  {
    id: 'gemini-video',
    name: 'Gemini video (Veo)',
    icon: '🎬',
    color: '#ff7a00',
    oneLiner: 'Gemini can make short video clips (about 8 seconds) with sound, from words or a photo.',
    likeA: 'A tiny film studio in your pocket.',
    usedIn: 'Quest 2 (Video)',
    cost: 'Only a few clips a day. Paid plans give more.',
    account: 'Your own Google account. Video making is usually 18+.',
    url: 'https://gemini.google.com',
    setup: [
      'Open gemini.google.com and sign in.',
      'Look for the video tool (it may say "Video" or "Veo") in the tools menu next to the chat box.',
      'Write your prompt with the Video Prompt Formula. Add camera moves and sound!',
      'Wait a minute or two. Clips take longer than pictures.',
      'Download the clip and put it in one folder for your project.'
    ],
    firstTry: {
      label: 'Your first clip',
      prompt:
        'A paper airplane flies through a cozy classroom and lands on a desk. Camera follows the plane. Bright cartoon style, morning light. Sound: soft whoosh, then a happy "ding".'
    },
    tips: [
      'Clips are limited, so plan each prompt on paper first (storyboard!).',
      'One clip = one shot. Make many short clips, then join them in Google Vids.',
      'Name the camera move: zoom in, pan left, follow, circle around.',
      'Want the same character in each clip? Make a picture first, then turn the picture into video.'
    ],
    stuck: [
      ['I can\'t find video.', 'It may not be on your plan or account age. Ask your teacher, or try it inside Google Vids.'],
      ['The clip is strange.', 'Simplify: one subject, one action, one camera move.'],
      ['No clips left today.', 'Work on your script and storyboard now. Make clips tomorrow.']
    ],
    safety: ['No real people, no real brands.', 'Always say #MadeWithAI. Fake videos of real events can hurt people.'],
    match: /\bVeo\b|Gemini with Veo|video clip/i
  },
  {
    id: 'google-vids',
    name: 'Google Vids',
    icon: '🎞️',
    color: '#9b51e0',
    oneLiner: 'A simple video editor. You put your clips in order, add words, voice and music.',
    likeA: 'A slideshow app, but for video.',
    usedIn: 'Quest 2 (Video)',
    cost: 'Comes with some Google accounts (like school or Workspace). AI parts may need a paid plan.',
    account: 'Your Google account. AI features are 18+.',
    url: 'https://vids.google.com',
    setup: [
      'Go to vids.google.com and sign in.',
      'Click to make a new, blank video.',
      'Upload your clips (drag them in from your folder).',
      'Drag clips on the timeline (the strip at the bottom) to put them in order.',
      'Add a title card, captions, music or your own voice.',
      'Click Share or Download when you are done.'
    ],
    tips: [
      'Trim the boring start and end of each clip. Short = better.',
      'Turn captions on. Many people watch with no sound.',
      'Record your voice in a quiet room, close to the mic.'
    ],
    stuck: [
      ["I can't open Vids.", 'Your account may not have it. Use any free editor you know (like the one on your phone).'],
      ['My clip won\'t upload.', 'Check the file is a video (like .mp4). Try a smaller file or a different browser.']
    ],
    safety: ['Only use music you are allowed to use (Vids has free music).', 'Share with a link only to people you choose.'],
    match: /Google Vids|\bVids\b/
  },
  {
    id: 'slides-canva',
    name: 'Google Slides / Canva',
    icon: '🖼️',
    color: '#f4b400',
    oneLiner: 'Tools to put pictures and words together on a page: posters, posts, decks.',
    likeA: 'A big table where you arrange your cut-outs.',
    usedIn: 'Quest 1 (Images) and Demo Day',
    cost: 'Free.',
    account: 'Google account for Slides. Canva has a free plan and a free plan for schools.',
    url: 'https://slides.google.com',
    setup: [
      'Go to slides.google.com and click Blank (or canva.com and pick a size).',
      'Drag your pictures in from your folder.',
      'Click "Text box" to add words. Use your brand fonts and colors.',
      'Use File → Download to save as a picture or PDF.'
    ],
    tips: ['Fewer words = stronger slide. One big idea per slide.', 'Line things up. Neat looks pro.', 'Use the same 2 or 3 colors everywhere.'],
    stuck: [['My picture is blurry.', 'Use a bigger picture. Ask Gemini for a wide 16:9 picture for slides.']],
    safety: ['Only use pictures you made or are allowed to use.'],
    match: /Google Slides|\bSlides\b|Canva/
  },
  {
    id: 'teachable-machine',
    name: 'Teachable Machine & Quick, Draw!',
    icon: '🧪',
    color: '#14c38e',
    oneLiner: 'Free Google games that show how AI learns from examples.',
    likeA: 'Teaching a puppy a trick by showing it again and again.',
    usedIn: 'Quest 0 (Launch)',
    cost: 'Free. No account needed.',
    account: 'None.',
    url: 'https://teachablemachine.withgoogle.com',
    setup: [
      'Go to teachablemachine.withgoogle.com and click Get Started → Image Project.',
      'Name Class 1 and Class 2 (like "Cup" and "Pen").',
      'Click Webcam and hold the button to take many photos of each thing.',
      'Click Train Model. Wait.',
      'Hold up each thing in Preview. Does it guess right?'
    ],
    tips: ['More examples = smarter AI.', 'Try to trick it with a messy background. That shows why training data matters.', 'Quick, Draw!: quickdraw.withgoogle.com. Draw and watch the AI guess.'],
    stuck: [['The webcam won\'t turn on.', 'Click "Allow" when the browser asks. Check no other app is using the camera.']],
    safety: ['Point the camera at things, not people, unless they say yes.'],
    match: /Teachable Machine|Quick, Draw/
  },
  {
    id: 'claude',
    name: 'Claude (chat)',
    icon: '🧡',
    color: '#d97757',
    oneLiner: "Anthropic's AI helper. Great at writing, explaining, checking and building things.",
    likeA: 'A patient coach who is also a great writer and coder.',
    usedIn: 'Quest 0 to compare, then every quest from Quest 3 on',
    cost: 'Free plan for chat. Paid plans (Pro or higher) give more use and Claude Code.',
    account: 'You must be 18 or older. Use your own account.',
    url: 'https://claude.ai',
    setup: [
      'Go to claude.ai (or get the Claude app) and sign up with your email or Google account.',
      'Type in the box at the bottom and press Enter.',
      'Click the + or 📎 to add a file or picture to your message.',
      'Use a new chat for each new topic.'
    ],
    firstTry: {
      label: 'Your first Claude chat',
      prompt:
        'I am brand new to building with AI. In 5 simple steps, explain how I could make my own one-page website with your help. Use easy words. Then ask me what my website should be about.'
    },
    tips: [
      'Tell Claude your level: "I am a beginner. Use simple words."',
      'Ask it to explain anything you don\'t understand: "What does ___ mean?"',
      'Ask for steps one at a time: "Give me only step 1. I will say done."',
      'Paste error messages in and ask: "What does this mean and how do I fix it?" (Never paste passwords or keys.)'
    ],
    stuck: [
      ['It says I reached my limit.', 'Free plans have limits that reset after a few hours. Come back later, or ask your teacher.'],
      ['The answer is too hard.', 'Say: "Explain that like I am new to this, in 3 short steps."'],
      ['It got something wrong.', 'Tell it exactly what is wrong. Check facts in 2 trusted places.']
    ],
    safety: ['No passwords, secret keys or private info.', 'Check facts. Say when you used AI.'],
    match: /\bClaude\b(?! Code| Projects| API| Console|\s*\(artifacts)/
  },
  {
    id: 'claude-artifacts',
    name: 'Claude artifacts',
    icon: '🪄',
    color: '#c2410c',
    oneLiner: 'When Claude makes something you can see or use (a web page, a game, a quiz), it shows up in a window next to the chat. That is an artifact.',
    likeA: 'A magic whiteboard where your idea comes to life while you talk.',
    usedIn: 'Quest 3 (Websites) and Quest 6 (Games), plus quick tries in Quest 5',
    cost: 'Free plan can make and share artifacts.',
    account: 'Claude account (18+).',
    url: 'https://claude.ai',
    setup: [
      'Open claude.ai and start a new chat.',
      'Ask for something you can click: "Make a one-page website for…" or "Make a simple game where…".',
      'It opens in a window on the right. Try it right there!',
      'Ask for changes in the chat, one at a time. Each change makes a new version.',
      'To share, look for the Publish or Share button on the artifact. You get a link.'
    ],
    firstTry: {
      label: 'Your first artifact',
      prompt:
        'Make a simple, colorful web page game: a button that says "Click me!" and a score that goes up by 1 each click. Add a fun sound or animation at 10 points. Make it work on a phone.'
    },
    tips: [
      'Small steps! Get the basic thing working, then add one feature at a time.',
      'If a change breaks it, ask: "Go back to the last version that worked."',
      'Use the version arrows to look at older versions.'
    ],
    stuck: [
      ['I don\'t see the window.', 'Ask: "Show this as an artifact I can try." Make sure your window is wide enough.'],
      ['The game or page doesn\'t work.', 'Say what you see: "When I click start, nothing happens." Claude will fix it.'],
      ['I can\'t find Publish.', 'Look at the top of the artifact window. Some accounts call it Share.']
    ],
    safety: ['Published links can be opened by anyone with the link.', 'No personal info inside what you publish.'],
    match: /artifact/i
  },
  {
    id: 'claude-projects',
    name: 'Claude Projects',
    icon: '🗂️',
    color: '#b45309',
    oneLiner: 'A Project is a Claude workspace with saved instructions and files. Every chat inside it remembers them.',
    likeA: 'Training a new helper with a rule book and a folder of facts.',
    usedIn: 'Quest 4 (AI Agents)',
    cost: 'Available in Claude. Paid plans give more use.',
    account: 'Claude account (18+).',
    url: 'https://claude.ai/projects',
    setup: [
      'In claude.ai, click Projects in the side menu, then Create project.',
      'Give it a name (like "Store Helper").',
      'Find "Instructions" (or project instructions) and write who the helper is and its rules.',
      'Add files to the project knowledge (like your store facts).',
      'Start a chat INSIDE the project and test it.'
    ],
    firstTry: {
      label: 'Starter instructions',
      prompt:
        'You are the friendly helper for my made-up store "[name]". Only answer questions about the store, using the facts in the project files. If you don\'t know, say "I\'m not sure, let me ask a human." Keep answers under 3 sentences. Never ask for personal info.'
    },
    tips: ['Test with tricky questions. Write down where it fails, then fix the instructions.', 'Clear rules beat long rules.', 'Keep a list of test questions and try them after every change.'],
    stuck: [['It ignores my facts.', 'Check the file is in the project, not just one chat. Add: "Only use the project files."']],
    safety: ['Use made-up customers and orders, never real people\'s info.'],
    match: /Claude Projects?|\bProject knowledge|\bProject instructions/
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: '👩‍💻',
    color: '#9a3412',
    oneLiner: 'Claude working as a coder. It makes and changes all the files of your website, app or game.',
    likeA: 'A builder who follows your plan, while you are the boss.',
    usedIn: 'Quest 3 (Websites), Quest 5 (Apps), Quest 6 (Games)',
    cost: 'Needs a paid Claude plan (Pro or higher).',
    account: 'Claude account (18+) and a free GitHub account.',
    url: 'https://claude.ai/code',
    setup: [
      'First make a free GitHub account and a repo (see the GitHub guide).',
      'Go to claude.ai/code (or open the Claude desktop app and pick Code).',
      'Connect your GitHub account when it asks. Click to allow.',
      'Pick your repo.',
      'Type what to build, like a normal chat. Claude Code writes the files.',
      'When it is done, it saves (commits) the files to your repo. Vercel then puts it online.'
    ],
    firstTry: {
      label: 'A good first build ask',
      prompt:
        'I am a beginner. Build a one-page website in plain HTML, CSS and JavaScript about [my topic]. Keep it simple and phone-friendly. When you are done, explain in simple words what each file does, and save the files to the repo.'
    },
    tips: [
      'You are the boss: say WHAT you want, Claude Code works out HOW.',
      'One change at a time. Check it. Then the next change.',
      'If Claude Code asks you a question, answer it. It means it wants to get it right.',
      'Say "Explain what you changed in simple words" after each change.',
      'Something broke? Say what you see, and paste any red error message.'
    ],
    stuck: [
      ['It says I need a paid plan.', 'Claude Code needs Pro or higher. Ask your teacher, or build it as an artifact for now.'],
      ["I can't see my repo.", 'Check you connected the right GitHub account and gave access to that repo.'],
      ['My change isn\'t on my live site.', 'Ask Claude Code: "Did you save and push the change?" Then wait a minute and refresh.'],
      ['Too many changes broke things.', 'Ask: "Undo your last change." GitHub keeps every old version.']
    ],
    safety: ['Never type passwords or secret keys into your code or chat.', 'Read what it made before you share it.'],
    match: /Claude Code/
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    color: '#24292f',
    oneLiner: 'A website that keeps your project files safe in a folder called a repo, and remembers every change.',
    likeA: 'A save-game system for your project. You can always go back.',
    usedIn: 'Quests 3, 5 and 6',
    cost: 'Free.',
    account: 'Free account (13+). Use your email, not your full real name, as your username if you like.',
    url: 'https://github.com',
    setup: [
      'Go to github.com and click Sign up. Follow the steps and check your email.',
      'Click the + at the top right, then New repository.',
      'Name it with small words and dashes, like my-cool-site.',
      'Pick Private or Public (ask your teacher). Click Create repository.',
      'That\'s it! Claude Code will fill it with files.'
    ],
    tips: ['Repo = project folder. Commit = a save with a note. You will see these words a lot.', 'Click "Commits" in your repo to see every save and go back in time.'],
    stuck: [['I forgot which repo.', 'Click your picture (top right) → Your repositories.']],
    safety: ['Never put passwords or API keys in a repo, even a private one.', 'Turn on two-step login in Settings for safety.'],
    match: /GitHub|\brepo\b/
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: '🚀',
    color: '#111111',
    oneLiner: 'Puts your project online with a real web address. It updates by itself every time your repo changes.',
    likeA: 'A shop that opens your website to the world, and restocks it every time you save.',
    usedIn: 'Quests 3, 5 and 6',
    cost: 'Free for personal projects.',
    account: 'Free account (18+). Sign up with "Continue with GitHub". It is the easiest way.',
    url: 'https://vercel.com',
    setup: [
      'Go to vercel.com and click Sign Up → Continue with GitHub.',
      'Click Add New → Project.',
      'Find your repo in the list and click Import. (Can\'t see it? Click the link to give Vercel access to it.)',
      'Leave the settings as they are and click Deploy.',
      'Wait about a minute. Click the picture of your site. You now have a live link! 🎉'
    ],
    tips: [
      'Your link looks like my-cool-site.vercel.app. Open it on your phone!',
      'Secret keys go in Settings → Environment Variables, never in your code.',
      'Every save in GitHub makes a new deploy. Click Deployments to see them.'
    ],
    stuck: [
      ['The deploy says Error.', 'Click the deploy, then the build log. Copy the red error into Claude Code and ask it to fix it.'],
      ["I can't find my repo.", 'Click "Adjust GitHub App Permissions" (or similar) and give Vercel access to that repo.'],
      ['My site shows a login page.', 'That is Vercel Protection. Use the main .vercel.app link, or ask your teacher.']
    ],
    safety: ['Your site is public. No home address, phone number or private info on it.'],
    match: /Vercel|\bdeploy/i
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: '🗄️',
    color: '#3ecf8e',
    oneLiner: 'A cloud database (a place to save data online) with logins built in.',
    likeA: 'A giant locked filing cabinet. Each user has a key to only their own drawer.',
    usedIn: 'Quest 5 (Apps) and Quest 6 (Games leaderboard)',
    cost: 'Free for small projects. Free projects can pause if unused for a while. You can restart them.',
    account: 'Free account (18+). Sign in with GitHub.',
    url: 'https://supabase.com',
    setup: [
      'Go to supabase.com → Start your project → sign in with GitHub.',
      'Click New project. Give it a name and make a strong database password (save it somewhere safe, not in your code).',
      'Wait a few minutes while it gets ready.',
      'Find the Project URL and the public (anon / publishable) key under Project Settings → API.',
      'Give these to Claude Code by putting them in Vercel Environment Variables, and tell Claude Code their names.',
      'Ask Claude Code to make the tables and turn on Row Level Security (RLS).'
    ],
    tips: [
      'RLS (Row Level Security) = each person only sees their own rows. ALWAYS on.',
      'Look at your data in the Table Editor. It looks like a spreadsheet.',
      'The "service role" key is a master key. Never put it in your app or show it to anyone.'
    ],
    stuck: [
      ['My project is paused.', 'Open it in Supabase and click Restore. Free projects nap when not used.'],
      ['Data won\'t save.', 'Often it is RLS blocking it (that is good!). Ask Claude Code: "Check my RLS rules let users save their own data."']
    ],
    safety: ['Turn on RLS for every table.', 'Use made-up test data.', 'Let users delete their own data.'],
    match: /Supabase|Row Level Security|\bRLS\b|database/i
  },
  {
    id: 'claude-api',
    name: 'Claude API (Claude Console)',
    icon: '🔑',
    color: '#7c3aed',
    oneLiner: 'The API lets your own app, script or game talk to Claude in the background.',
    likeA: 'A phone line from your app straight to Claude. The API key is the phone number, so keep it secret!',
    usedIn: 'Quest 4 (AI step), Quest 5 (AI feature), Quest 6 (AI character)',
    cost: 'Pay as you go with prepaid credit. Set a monthly spending limit! Claude Haiku is very cheap.',
    account: 'Console account (18+) at platform.claude.com.',
    url: 'https://platform.claude.com',
    setup: [
      'Go to platform.claude.com and sign up.',
      'Add a small amount of credit, then set a monthly spending limit (in the billing or limits settings).',
      'Find API Keys and click Create Key. Give it a name.',
      'Copy the key ONCE and put it straight into a safe place: Script Properties (Apps Script) or Vercel Environment Variables.',
      'Never paste the key into chat, code, a doc or a screenshot.'
    ],
    tips: [
      'Start with a cheap, fast model like Claude Haiku for testing.',
      'Add a daily limit per user in your app, so no one can use up your money.',
      'Always have a fallback: if the AI is down, show a ready-made answer.'
    ],
    stuck: [
      ['Error 401 / invalid key.', 'The key is wrong or missing. Check the name of the variable matches the code. Make a new key if needed.'],
      ['Error about credit.', 'Add credit in the Console. Check your spending limit.'],
      ['I shared my key by mistake!', 'Go to the Console right away, delete that key and make a new one. Tell your teacher.']
    ],
    safety: ['The key is like a credit card. Keep it secret.', 'Use made-up data, never real people\'s private info.'],
    match: /Claude API|Claude Console|API key|\bAPI\b/
  },
  {
    id: 'apps-script',
    name: 'Google Apps Script',
    icon: '⚙️',
    color: '#0f9d58',
    oneLiner: 'Little programs that work inside Google Sheets, Forms and Gmail. They do busy work for you.',
    likeA: 'A tiny robot that lives in your spreadsheet.',
    usedIn: 'Quest 4 (AI Agents & Workflows)',
    cost: 'Free (with daily limits on emails and runs).',
    account: 'Your Google account.',
    url: 'https://script.google.com',
    setup: [
      'Open your Google Sheet. Click Extensions → Apps Script.',
      'Ask Claude to write the script for you. Say what it should do, in plain words.',
      'Delete what is in the editor and paste Claude\'s script. Click 💾 Save.',
      'Pick the function name at the top and click ▶ Run.',
      'Google will ask for permission. Click Review permissions → your account → Advanced → Go to project → Allow. (This is normal for your own script.)',
      'To make it run by itself: click ⏰ Triggers on the left → Add Trigger.'
    ],
    firstTry: {
      label: 'Ask Claude for a script',
      prompt:
        'I am a beginner. Write a Google Apps Script for my Google Sheet. When a new Google Form answer comes in, send a short thank-you email to the email in column B. Explain each part in simple words and tell me exactly how to add the trigger.'
    },
    tips: [
      'Keep secrets (like an API key) in ⚙️ Project Settings → Script Properties. Never in the code.',
      'Got a red error? Copy it into Claude and ask what it means.',
      'Test on a COPY of your sheet first.'
    ],
    stuck: [
      ['"Authorization required" or a scary warning.', 'It is your own script, so it is OK. Click Advanced → Go to (project) → Allow.'],
      ['Nothing happens.', 'Check you ran the right function, and look at Executions on the left for errors.']
    ],
    safety: ['Test with made-up emails and orders.', 'Never put keys in the code.'],
    match: /Apps Script|Script Properties|\btrigger/i
  },
  {
    id: 'forms-sheets',
    name: 'Google Forms + Sheets',
    icon: '📋',
    color: '#673ab7',
    oneLiner: 'Forms collects answers. Sheets is a spreadsheet that stores them in rows.',
    likeA: 'A sign-up clipboard (Forms) and a neat notebook that copies every answer (Sheets).',
    usedIn: 'Quest 3 (order form, survey) and Quest 4 (your helper\'s desk)',
    cost: 'Free.',
    account: 'Your Google account.',
    url: 'https://forms.google.com',
    setup: [
      'Go to forms.google.com → Blank form.',
      'Add questions with the + button. Pick the question type (short answer, multiple choice…).',
      'Click Responses → Link to Sheets to send every answer to a spreadsheet.',
      'Click Send (or the link icon) to get a link to share.'
    ],
    tips: ['Only ask for what you really need. Less data = safer.', 'Try your own form first, to check it works.'],
    stuck: [['I can\'t see answers in the sheet.', 'Check Responses → Link to Sheets is on, and that you submitted a test answer.']],
    safety: ['Don\'t ask for home addresses, birthdays or IDs.'],
    match: /Google Forms|Google Sheets|\bForms\b|\bSheets?\b/
  },
  {
    id: 'stripe',
    name: 'Stripe (test mode)',
    icon: '💳',
    color: '#635bff',
    oneLiner: 'Stripe runs online checkouts. In test mode, you practice with pretend cards. No real money moves.',
    likeA: 'A toy cash register that works just like the real one.',
    usedIn: 'Quest 3 (optional shop level-up)',
    cost: 'Free in test mode.',
    account: 'Account owner must be 18+.',
    url: 'https://stripe.com',
    setup: [
      'Sign up at stripe.com. Make sure "Test mode" (or a sandbox) is ON.',
      'Make a product with a price.',
      'Make a Payment Link for it and copy the link.',
      'Ask Claude Code to connect your Buy button to that link.',
      'Test it with the pretend card 4242 4242 4242 4242, any future date, any 3 numbers.'
    ],
    tips: ['Stay in test mode in class. Always.'],
    stuck: [['My real card got asked for.', 'Stop! You are not in test mode. Turn test mode on.']],
    safety: ['Never use real cards in class.'],
    match: /Stripe|test mode/i
  },
  {
    id: 'screen-readers',
    name: 'Screen readers',
    icon: '🔊',
    color: '#1cb0f6',
    oneLiner: 'Tools that read a screen out loud for people who are blind or can\'t see well.',
    likeA: 'A friend who reads every button and picture to you.',
    usedIn: 'Quest 3 (making your site work for everyone)',
    cost: 'Free. Built into phones and computers.',
    account: 'None.',
    setup: [
      'iPhone: Settings → Accessibility → VoiceOver. Android: Settings → Accessibility → TalkBack.',
      'Mac: press Cmd + F5. Windows: Narrator (Ctrl + Win + Enter).',
      'Open your site and listen. Does every picture have alt text? Do buttons make sense?',
      'Turn it off the same way when done (it changes how taps work!).'
    ],
    tips: ['Learn how to turn it OFF before you turn it on.', 'Good alt text says what the picture shows and why it matters.'],
    stuck: [['My phone acts weird now!', 'With VoiceOver/TalkBack on, tap once to pick, double-tap to open. Turn it off in the same settings.']],
    safety: [],
    match: /[Ss]creen reader|VoiceOver|TalkBack/
  }
];

export const guideById = (id: string) => GUIDES.find((g) => g.id === id);

// The main tool of a quest is always shown, even if a mission doesn't name it.
const QUEST_MAIN: Record<string, string[]> = {
  '00-launch': ['gemini'],
  '01-images': ['gemini-images'],
  '02-video': ['gemini-video', 'google-vids'],
  '03-web': ['claude-artifacts'],
  '04-agents': ['claude-projects'],
  '05-apps': ['claude-code'],
  '06-games': ['claude-artifacts']
};

/** Which tool guides a piece of text uses, in course order. */
export function guidesIn(text: string, moduleId?: string): ToolGuide[] {
  const main = (moduleId && QUEST_MAIN[moduleId]) || [];
  return GUIDES.filter((g) => main.includes(g.id) || g.match.test(text));
}

/** The help ladder: what to do when you are stuck, in order. */
export const STUCK_LADDER = [
  { icon: '👀', title: 'Read it again', text: 'Read the step out loud, slowly. Look for a word you skipped.' },
  { icon: '🧰', title: 'Check the tool guide', text: 'Each tool has a "Stuck?" list with fixes for the common problems.' },
  { icon: '🤖', title: 'Ask the AI', text: 'Copy the help prompt below. Paste it into Claude or Gemini. Add what you see.' },
  { icon: '🔁', title: 'Try a smaller step', text: 'Do just one part. Get it working. Then add the next part.' },
  { icon: '🙋', title: 'Ask your teacher', text: 'Show what you tried. That is a great habit, not a weakness!' }
];

export const HELP_PROMPT = `I am a beginner and I am stuck.
What I am trying to do: [the step]
What I did: [what you clicked or typed]
What I see: [what happened, or paste the error message]
Please explain what is going on in simple words and give me the next step only. Don't use hard words.`;
