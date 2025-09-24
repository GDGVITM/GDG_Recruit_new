import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Smartphone, 
  Cloud, 
  Brain, 
  Users, 
  Trophy, 
  Calendar,
  MapPin,
  ArrowRight,
  Star
} from 'lucide-react';

const opportunities = [
  {
    id: 1,
    title: 'Core Team Member',
    description: 'Lead technical initiatives and organize community events',
    requirements: ['Leadership experience', 'Strong technical skills', 'Event management'],
    icon: Users,
    color: 'text-google-blue',
    bgColor: 'bg-google-blue/10',
    spots: '5 positions',
    commitment: 'High',
    featured: true
  },
  {
    id: 2,
    title: 'Web Development Track',
    description: 'Build amazing web applications and lead workshops',
    requirements: ['React/Angular/Vue', 'Node.js', 'Database knowledge'],
    icon: Code,
    color: 'text-google-red',
    bgColor: 'bg-google-red/10',
    spots: '10 positions',
    commitment: 'Medium'
  },
  {
    id: 3,
    title: 'Mobile Development',
    description: 'Create mobile apps and share your expertise',
    requirements: ['Flutter/React Native', 'Native development', 'UI/UX basics'],
    icon: Smartphone,
    color: 'text-google-yellow',
    bgColor: 'bg-google-yellow/10',
    spots: '8 positions',
    commitment: 'Medium'
  },
  {
    id: 4,
    title: 'Cloud & DevOps',
    description: 'Work with Google Cloud Platform and modern DevOps',
    requirements: ['GCP knowledge', 'Docker/Kubernetes', 'CI/CD pipelines'],
    icon: Cloud,
    color: 'text-google-green',
    bgColor: 'bg-google-green/10',
    spots: '6 positions',
    commitment: 'Medium'
  },
  {
    id: 5,
    title: 'AI/ML Specialist',
    description: 'Explore machine learning and artificial intelligence',
    requirements: ['Python/TensorFlow', 'Data science', 'ML algorithms'],
    icon: Brain,
    color: 'text-google-blue',
    bgColor: 'bg-google-blue/10',
    spots: '7 positions',
    commitment: 'High'
  },
  {
    id: 6,
    title: 'Community Manager',
    description: 'Grow our community and manage social media presence',
    requirements: ['Social media skills', 'Content creation', 'Communication'],
    icon: Trophy,
    color: 'text-google-red',
    bgColor: 'bg-google-red/10',
    spots: '4 positions',
    commitment: 'Medium'
  }
];

const benefits = [
  {
    title: 'Google Swag & Certificates',
    description: 'Exclusive merchandise and official certificates',
    icon: Trophy
  },
  {
    title: 'Industry Networking',
    description: 'Connect with Google engineers and industry experts',
    icon: Users
  },
  {
    title: 'Skill Development',
    description: 'Access to premium courses and training resources',
    icon: Brain
  },
  {
    title: 'Event Access',
    description: 'Free access to Google events and conferences',
    icon: Calendar
  }
];

export const CardsSection = () => {
  return (
    <section id="cards-section" className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-google-blue">Opportunities</span> Await
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your track and start your journey with Google Developer Groups. 
            Each position offers unique learning opportunities and real-world experience.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {opportunities.map((opportunity) => {
            const IconComponent = opportunity.icon;
            return (
              <Card 
                key={opportunity.id} 
                className={`relative group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 ${
                  opportunity.featured ? 'ring-2 ring-google-blue/30' : ''
                }`}
              >
                {opportunity.featured && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-google-blue text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${opportunity.bgColor} flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 ${opportunity.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {opportunity.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Requirements:</h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {opportunity.spots}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {opportunity.commitment}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-card/50 rounded-2xl p-8 md:p-12 border border-border">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Why Join <span className="text-google-green">GDG</span>?
            </h3>
            <p className="text-muted-foreground text-lg">
              Being part of GDG comes with amazing perks and opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 p-6 bg-card border border-border rounded-2xl">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">Ready to Get Started?</h4>
              <p className="text-muted-foreground">Applications are open now. Don't miss this opportunity!</p>
            </div>
            <Button className="bg-google-blue hover:bg-google-blue/90 text-white gdg-glow">
              Apply Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};