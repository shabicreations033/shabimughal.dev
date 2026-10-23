import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>© {new Date().getFullYear()} Shabi Mughal. All rights reserved.</span>
        <SocialIcons variant="text" />
      </div>
    </footer>
  );
}
