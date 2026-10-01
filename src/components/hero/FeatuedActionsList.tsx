'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import PageHeader from '../global/PageHeader';
import { ActionCard } from './FeaturedActionsCard';

interface ActionListProps {
  actions: any[];
  title?: string;
  showViewAll?: boolean;
}

const FeaturedActionsList: React.FC<ActionListProps> = ({
  actions,
  title = 'Istaknute akcije',
  showViewAll = true,
}) => {
  if (!actions || actions.length === 0) {
    return <p className="text-center text-lg text-current">Trenutno nemamo akcije za prikaz</p>;
  }

  return (
    <section className="flex w-full flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mb-8 w-full text-center"
      >
        <PageHeader
          title={title}
          description="Pregledajte najnovije zakazane ekološke akcije i pridružite se volontiranju koje donosi stvarne rezultate."
        />
      </motion.div>

      <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ActionCard action={action} />
          </motion.div>
        ))}
      </div>

      {showViewAll && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button variant="link" className="mt-6" asChild>
            <Link href="/actions" className="flex items-center gap-2">
              Pogledaj sve akcije <ArrowRightIcon />
            </Link>
          </Button>
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedActionsList;
