import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/chat"
            className="group relative rounded-lg border p-4 hover:border-zinc-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageIcon />
              <h2 className="font-semibold">New Chat</h2>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Start a new conversation with the AI assistant.
            </p>
          </Link>

          <Link
            href=""
            target="_blank"
            className="group relative rounded-lg border p-4 hover:border-zinc-400 transition-colors"
          >
            <div className="flex items-center gap-3">
              <VercelIcon />
              <h2 className="font-semibold">Download</h2>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Download the file to your local machine.
            </p>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
