export type BlogCategory = "Strategy" | "Content" | "Video" | "Profiles";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
  glow: "purple" | "blue" | "coral" | "lime";
};

/**
 * Resources.
 *
 * Written as advice a business can act on today, not as case studies. Nothing
 * here claims a result we produced for a client, quotes a metric we cannot
 * evidence, or implies a track record. If a post cannot be written honestly
 * by a new company, it does not go up.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "one-platform-done-properly",
    title: "One platform done properly beats four kept half-alive",
    excerpt:
      "Most small businesses spread themselves across every network and end up invisible on all of them. Here is how to choose the one that is worth your time.",
    content: [
      "The instinct when you start taking social media seriously is to claim every handle and post everywhere. It feels like coverage. In practice it usually produces four accounts that each look abandoned, which is a worse signal than not being there at all.",
      "A visitor who lands on a profile that last posted in March does not think 'they must be busy'. They think the business might not still be running. An empty-looking account actively costs you something, which is why fewer channels is often the stronger move.",
      "Choosing the one to keep is less about which platform is biggest and more about three things: where your customers already spend time, which format you can realistically sustain, and where your kind of business actually shows well. A trade with visible before-and-after work has a different answer to a consultancy.",
      "Sustainability matters more than reach here. Two posts a week you can keep up for a year will do more for you than a daily plan you abandon in five weeks. Pick the cadence you can hold on your busiest month, not your quietest one.",
      "Once one channel is genuinely consistent — steady posting, replies answered, a profile that explains the business — adding a second is a much smaller job, because the content and the voice already exist. Start narrow on purpose.",
    ],
    category: "Strategy",
    author: "NPeripheral",
    publishedAt: "2026-02-03",
    readingTime: 4,
    featured: true,
    glow: "purple",
  },
  {
    slug: "profile-audit-checklist",
    title: "The 10-minute profile audit most businesses have never done",
    excerpt:
      "Before posting anything new, check whether your existing profile answers the four questions every visitor arrives with.",
    content: [
      "Most of the value sitting unclaimed in a small business's social media is not in future posts. It is in the profile people already land on, which was written once when the account was created and never revisited.",
      "Open your profile on a phone, not a desktop, and read it as a stranger. Four questions need answering above the fold: what does this business do, where does it operate, is it currently open for business, and what do I do next.",
      "The 'what do you do' line is where most profiles fail. Industry language you would use with a peer often means nothing to a customer. 'Full-service solutions provider' tells no one anything. Say the actual thing you sell.",
      "Location and service area are worth stating explicitly even if it feels obvious to you. Someone two towns over cannot tell whether you cover them, and most will not message to ask.",
      "The next step should be a single, obvious action — book, call, order, message — with a link that goes straight to it rather than to a homepage the visitor then has to navigate. Every extra tap loses people.",
      "None of this requires new content. It is an afternoon of editing that makes every post afterwards work harder, which is why it is the first thing worth doing.",
    ],
    category: "Profiles",
    author: "NPeripheral",
    publishedAt: "2026-02-17",
    readingTime: 5,
    glow: "blue",
  },
  {
    slug: "short-form-video-without-a-studio",
    title: "Short-form video without a studio, a team, or a script",
    excerpt:
      "You do not need production value to make short-form work. You need a repeatable format and a reason for someone to keep watching past the first second.",
    content: [
      "The barrier to short-form video is rarely equipment. Phones have been good enough for years. The barrier is that most businesses approach every video as a one-off creative problem, which is exhausting and produces nothing consistent.",
      "The fix is a format: one repeatable structure you can refill with new material each week. A trade might use the same three-shot pattern — problem, work, result — every single time. The repetition is a feature, because a recognisable format is easier to make and easier to follow.",
      "The opening moment does most of the work. Not a logo, not a greeting, and not a slow build — show the thing, or state the specific question the video answers. If the first second could belong to any business, it is doing nothing for yours.",
      "Vertical, captioned, and watchable on mute is the practical baseline. A large share of viewing happens with sound off, and captions are the difference between someone watching and someone scrolling on.",
      "Batch the filming. Capturing four videos in one session while the light and the setup are already right is dramatically easier than finding a moment four separate times, and it is usually what makes a weekly cadence survive a busy month.",
    ],
    category: "Video",
    author: "NPeripheral",
    publishedAt: "2026-03-04",
    readingTime: 5,
    glow: "coral",
  },
];
