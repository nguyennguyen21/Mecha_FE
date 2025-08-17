import { useEffect } from "react";
import Background from "../../modules/Core/components/Background/Background";

const RedirectToDiscord = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://discord.gg/Gf2mwk6HuY";
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Background>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 bg-black/70 text-white rounded-lg shadow-lg backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-4">Redirecting to our Discord server...</h1>
          <p className="text-gray-200">
            If you are not redirected automatically,{" "}
            <a
              href="https://discord.gg/Gf2mwk6HuY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-600"
            >
              click here
            </a>
            .
          </p>
        </div>
      </div>
    </Background>
  );
};

export default RedirectToDiscord;
