import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    year: '',
    skills: '',
    experience: '',
    motivation: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    setIsFormOpen(false);
    setFormData({
      name: '',
      email: '',
      university: '',
      year: '',
      skills: '',
      experience: '',
      motivation: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center gdg-glow">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">GDG Recruitment</span>
              <span className="text-xs text-muted-foreground">2024-2025</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-google-blue transition-colors">
              Home
            </a>
            <a href="#opportunities" className="text-foreground hover:text-google-blue transition-colors">
              Opportunities
            </a>
            <a href="#about" className="text-foreground hover:text-google-blue transition-colors">
              About GDG
            </a>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="gdg-glow bg-google-blue hover:bg-google-blue/90 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-google-blue">
                    Join GDG Community
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="scan-effect"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="scan-effect"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University/College *</Label>
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        required
                        className="scan-effect"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year *</Label>
                      <Select onValueChange={(value) => handleInputChange('year', value)}>
                        <SelectTrigger className="scan-effect">
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Technical Skills & Interests</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="e.g., Web Development, Mobile Apps, AI/ML, Cloud Computing, etc."
                      className="scan-effect min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Previous Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Tell us about your projects, internships, or relevant experience"
                      className="scan-effect min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivation">Why do you want to join GDG? *</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      placeholder="Share your motivation and what you hope to achieve"
                      required
                      className="scan-effect min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-google-blue hover:bg-google-blue/90 text-white gdg-glow"
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#home"
                className="block px-3 py-2 text-foreground hover:text-google-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
              <a
                href="#opportunities"
                className="block px-3 py-2 text-foreground hover:text-google-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Opportunities
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-foreground hover:text-google-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About GDG
              </a>
              <div className="px-3 py-2">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gdg-glow bg-google-blue hover:bg-google-blue/90 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};