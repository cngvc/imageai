import HeroImageSlider from "@/components/display/hero-image-slider";
import GenerateImageInput from "@/components/forms/generate-image-input";
import Container from "@/components/ui/container";

export default function Home() {
  return (
    <Container className="my-5">
      <div className="flex flex-col mb-8">
        <h2 className="text-4xl lg:text-6xl font-bold mb-2">
          <span className="text-8xl bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 text-transparent bg-clip-text animate-pulse">
            AI
          </span>
          <br />
          <span>Image Generator</span>
        </h2>
        <p>
          Creates unique images from text prompts, instantly turning ideas into
          art with just a few words.
        </p>
        <p>
          * It doesn't work with VN IPs, please use VPN instead. I will try to
          fix asap
        </p>
      </div>
      <GenerateImageInput />
      <div className="relative">
        <HeroImageSlider />
      </div>
    </Container>
  );
}
