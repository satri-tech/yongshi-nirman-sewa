import { statsData } from './constants'
import { motion } from 'framer-motion';
import {
  useScrollAnimation,
  staggerContainer,
  staggerItem
} from '@/hooks/use-scroll-animation';

export const StatsSection = () => {
  const statsAnimation = useScrollAnimation(0.2, true);

  return (
    <motion.div
      ref={statsAnimation.ref}
      variants={staggerContainer}
      initial="hidden"
      animate={statsAnimation.controls}
      className="flex justify-between gap-16 font-Poppins "
    >
      {statsData.map((data) => {
        return (
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:gap-4"
            key={data.label}
          >
            <motion.div className={`sm:text-5xl font-medium `}>
              {data.value}
            </motion.div>
            <motion.div className="text-[#656565] sm:text-base text-sm ">
              {data.label}
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
