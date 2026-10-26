import SocialIcons from './SocialIcons';
import Reveal from './Reveal';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Reveal as="div" className="wrap">
        <span>© {new Date().getFullYear()} Shabi Mughal. All rights reserved.</span>
        <SocialIcons variant="text" />
      </Reveal>
    </footer>
  );
}
