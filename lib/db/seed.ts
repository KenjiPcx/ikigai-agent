import { db } from './queries';
import { opportunity } from './schema';

async function seedOpportunities() {
  const opportunities = [
    {
      name: "AI-Powered Content Creation Studio",
      type: "Digital Business",
      description: "Build a business creating high-quality content using AI tools. Help businesses and creators scale their content production while maintaining quality and authenticity.",
      tags: JSON.stringify(["AI", "Content Creation", "Digital Marketing", "Creative"]),
      perfectFounderTraits: "Creative minds who understand both technology and storytelling",
    },
    {
      name: "Sustainable Urban Farming Solutions",
      type: "Green Tech",
      description: "Create innovative urban farming solutions using hydroponics and smart technology. Help cities become self-sustainable while building a greener future.",
      tags: JSON.stringify(["Sustainability", "AgTech", "Innovation", "Green Business"]),
      perfectFounderTraits: "Environmental enthusiasts with a technical background",
    },
    {
      name: "Digital Wellness Platform",
      type: "Health Tech",
      description: "Build a platform that combines mental health, fitness, and nutrition guidance using AI and human experts. Help people achieve holistic wellness in the digital age.",
      tags: JSON.stringify(["Health", "Wellness", "Tech", "AI"]),
      perfectFounderTraits: "Health-conscious innovators with strong tech understanding",
    },
    {
      name: "Custom AI Integration Service",
      type: "Tech Service",
      description: "Help businesses integrate and customize AI solutions for their specific needs. Bridge the gap between cutting-edge AI and practical business applications.",
      tags: JSON.stringify(["AI", "Business Services", "Tech", "Consulting"]),
      perfectFounderTraits: "Tech-savvy problem solvers with business acumen",
    },
    {
      name: "Personal Brand Academy",
      type: "Education",
      description: "Create a comprehensive platform teaching people how to build and monetize their personal brand in the AI age. Help individuals stand out and create unique value.",
      tags: JSON.stringify(["Personal Branding", "Education", "Digital Marketing"]),
      perfectFounderTraits: "Experienced personal branders who love teaching",
    },
    {
      name: "Automation Consulting Agency",
      type: "Business Services",
      description: "Help small businesses automate their operations using AI and modern tools. Create efficiency while helping preserve jobs through upskilling.",
      tags: JSON.stringify(["Automation", "Consulting", "AI", "Business"]),
      perfectFounderTraits: "Process optimization experts with strong people skills",
    }
  ];

  try {
    await db.insert(opportunity).values(opportunities);
    console.log('Successfully seeded opportunities');
  } catch (error) {
    console.error('Error seeding opportunities:', error);
  }
}

// Run the seed function
seedOpportunities(); 