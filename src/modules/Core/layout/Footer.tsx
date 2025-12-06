import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="bg-black-900 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">

        {/* Logo & Description */}
        <div className="flex flex-col space-y-4">
           <a
              href="https://mecha.lol"
              className="flex items-center space-x-2 no-underline text-white hover:text-blue-400 transition-colors"
            >
              <img
                src="./mecha.png"
                alt="Mecha Logo"
                className="w-1/2 max-w-[50px] object-contain animate-bounce-updown"
              />
              <span className="leading-none">Mecha.lol</span>
            </a>
          <p className="text-gray-400 max-w-sm">
            Bringing you the best experience. Connect all your socials and showcase your profile in style.
          </p>
        </div>

        {/* Discord */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-lg">Join Our Community</h3>
          <a 
            href="https://discord.gg/YOUR_DISCORD_INVITE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition flex items-center gap-2"
          >
            <i className="bi bi-discord text-xl"></i>
            <span>Discord</span>
          </a>
        </div>

      </div>

      <div className="mt-8 mb-8 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
