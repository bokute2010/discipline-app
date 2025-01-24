import { IAvatarsProps } from '@/partials/common';

interface ITeamData {
  team: {
    name: string;
    description: string;
  };
  rating: {
    value: number;
    round: number;
  };
  lastModified: string;
  members: IAvatarsProps; // Use IAvatarsProps for the members property
}

const TeamsData: ITeamData[] = [
  {
    team: {
      name: 'Product Management',
      description: 'Product development & lifecycle'
    },
    rating: { value: 5, round: 0 },
    lastModified: '21 Oct, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-4.png' }, { filename: '300-1.png' }, { filename: '300-2.png' }],
      more: { label: '10', variant: 'text-success-inverse ring-success-light bg-success' }
    }
  },
  {
    team: {
      name: 'Marketing Team',
      description: 'Campaigns & market analysis'
    },
    rating: { value: 3, round: 0.5 },
    lastModified: '15 Oct, 2024',
    members: {
      size: 'size-[30px]',
      group: [
        { filename: '300-4.png' },
        {
          fallback: 'G',
          variant: 'text-warning-inverse ring-warning-light bg-warning',
          filename: ''
        }
      ]
    }
  },
  {
    team: {
      name: 'HR Department',
      description: 'Talent acquisition, employee welfare'
    },
    rating: { value: 5, round: 0 },
    lastModified: '10 Oct, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-4.png' }, { filename: '300-1.png' }, { filename: '300-2.png' }],
      more: { label: 'A', variant: 'text-info-inverse ring-info-light bg-info' }
    }
  },
  {
    team: {
      name: 'Sales Division',
      description: 'Customer relations, sales strategy'
    },
    rating: { value: 5, round: 0 },
    lastModified: '05 Oct, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-24.png' }, { filename: '300-7.png' }]
    }
  },
  {
    team: {
      name: 'Development Team',
      description: 'Software development'
    },
    rating: { value: 4, round: 0.5 },
    lastModified: '01 Oct, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-3.png' }, { filename: '300-8.png' }, { filename: '300-9.png' }],
      more: { label: '5', variant: 'text-danger-inverse ring-danger-light bg-danger' }
    }
  },
  {
    team: {
      name: 'Quality Assurance',
      description: 'Product testing'
    },
    rating: { value: 5, round: 0 },
    lastModified: '25 Sep, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-6.png' }, { filename: '300-5.png' }]
    }
  },
  {
    team: {
      name: 'Finance Team',
      description: 'Financial planning'
    },
    rating: { value: 4, round: 0 },
    lastModified: '20 Sep, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-10.png' }, { filename: '300-11.png' }, { filename: '300-12.png' }],
      more: { label: '8', variant: 'text-primary-inverse ring-primary-light bg-primary' }
    }
  },
  {
    team: {
      name: 'Customer Support',
      description: 'Customer service'
    },
    rating: { value: 3, round: 0.5 },
    lastModified: '15 Sep, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-13.png' }, { filename: '300-14.png' }]
    }
  },
  {
    team: {
      name: 'R&D Team',
      description: 'Research & development'
    },
    rating: { value: 5, round: 0 },
    lastModified: '10 Sep, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-15.png' }, { filename: '300-16.png' }]
    }
  },
  {
    team: {
      name: 'Operations Team',
      description: 'Operations management'
    },
    rating: { value: 4, round: 0 },
    lastModified: '05 Sep, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-17.png' }, { filename: '300-18.png' }, { filename: '300-19.png' }]
    }
  },
  {
    team: {
      name: 'IT Support',
      description: 'Technical support'
    },
    rating: { value: 5, round: 0 },
    lastModified: '01 Sep, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-20.png' }, { filename: '300-21.png' }]
    }
  },
  {
    team: {
      name: 'Legal Team',
      description: 'Legal support'
    },
    rating: { value: 4, round: 0 },
    lastModified: '25 Aug, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-22.png' }, { filename: '300-23.png' }]
    }
  },
  {
    team: {
      name: 'Logistics Team',
      description: 'Supply chain'
    },
    rating: { value: 3, round: 0.5 },
    lastModified: '20 Aug, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-24.png' }, { filename: '300-25.png' }]
    }
  },
  {
    team: {
      name: 'Procurement Team',
      description: 'Supplier management'
    },
    rating: { value: 5, round: 0 },
    lastModified: '15 Aug, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-26.png' }, { filename: '300-27.png' }, { filename: '300-28.png' }],
      more: { label: '3', variant: 'text-info-inverse ring-info-light bg-info' }
    }
  },
  {
    team: {
      name: 'Training Team',
      description: 'Employee training'
    },
    rating: { value: 4, round: 0 },
    lastModified: '10 Aug, 2024',
    members: {
      size: 'size-[30px]',
      group: [{ filename: '300-29.png' }, { filename: '300-30.png' }]
    }
  }
];

export { TeamsData, type ITeamData };
