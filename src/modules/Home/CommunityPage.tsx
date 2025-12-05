import React from "react";
import Button from "../../modules/Core/Components/button/Button";

const COMMUNITY_DISCORD_LINK: string = "https://discord.gg/YOUR_DISCORD_INVITE";
const BADGE_STORE_LINK: string = "https://mechabot.com/badges";

const CommunityHero: React.FC = () => {
  const handleJoinClick = () => window.open(COMMUNITY_DISCORD_LINK, "_blank");
  const handleBadgeClick = () => window.open(BADGE_STORE_LINK, "_blank");

  return (
    <section className="w-full text-white py-20 px-6 md:px-20 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center md:text-left max-w-3xl">
        Welcome to the Mecha Community
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl text-center md:text-left">
        Join our official Discord community to connect with other users, participate in events, 
        get support, and collect exclusive badges!
      </p>

      {/* Action Buttons + Search */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl justify-center md:justify-start">
        <Button variant="primary" onClick={handleJoinClick}>
          Join Discord
        </Button>
        <Button variant="secondary" onClick={handleBadgeClick}>
          Buy Badges
        </Button>
      </div>
    </section>
  );
};

export default CommunityHero;
