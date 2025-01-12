import { motion } from 'framer-motion';

const Logo = ({ className = "w-14 h-14" }) => (
  <motion.img
    src="/aihash-logo.svg"
    alt="aiHash Logo"
    className={className}
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100 }}
  />
);

export default Logo;