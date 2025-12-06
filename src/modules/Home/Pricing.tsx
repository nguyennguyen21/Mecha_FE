import Button from "../../modules/Core/Components/button/Button";

const plans = [
  {
    name: "Free",
    price: "0€ / Lifetime",
    description: "For beginners, link all your socials in one place.",
    features: ["Basic Customization", "Profile Analytics", "Basic Effects", "Add Your Socials"],
    border: "border-gray-800",
    bg: "bg-[#101010]",
    badge: null,
  },
  {
    name: "Premium",
    price: "6,99€ / Lifetime",
    description: "Pay once. Keep it forever. The perfect plan to discover your creativity & unlock more features.",
    features: [
      "Exclusive Badge",
      "Profile Layouts",
      "Custom Fonts",
      "Typewriter Animation",
      "Special Profile Effects",
      "Advanced Customization",
      "Metadata & SEO Customization"
    ],
    border: "border-blue-500",
    bg: "bg-[#101010]",
    badge: "Most Popular",
  }
];

const Pricing = () => {
  const handleSelectPlan = (planName: string) => {
    alert(`You selected the ${planName} plan!`);
  };

  return (
    <div className="font-inte min-h-screen flex flex-col">
      <div className="px-6 md:px-20 mt-20 flex-1 text-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>

        <div className="flex flex-col md:flex-row justify-center mt-25 gap-8 flex-wrap items-center md:items-start space-y-8 md:space-y-0">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                ${plan.bg} ${plan.border} border-2 
                rounded-[15px] 
                p-6 flex-1 flex flex-col items-center text-center 
                shadow-lg transition-transform duration-300
                hover:scale-105 hover:shadow-2xl
                max-w-[370px] w-full relative
                ${plan.name === "Free" ? "mt-12 md:mt-16" : "-mt-6 md:-mt-12"}
              `}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-blue-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-xl font-semibold mb-2">{plan.price}</p>
              <p className="text-gray-300 mb-4 text-sm">{plan.description}</p>
              <ul className="mb-6 space-y-2 text-left w-full px-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-white flex items-center gap-2">
                    <span className="text-blue-400 font-bold">/</span> {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.name === "Premium" ? "primary" : "secondary"}
                onClick={() => handleSelectPlan(plan.name)}
                className={`
                  w-full py-3 rounded-lg 
                  transition-all duration-300
                  hover:scale-105 hover:shadow-lg hover:cursor-pointer
                  ${plan.name === "Premium" ? "bg-blue-500 text-black hover:bg-blue-400" : "bg-gray-700 text-white hover:bg-gray-600"}
                `}
              >
                {plan.name === "Premium" ? "Get Premium" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
