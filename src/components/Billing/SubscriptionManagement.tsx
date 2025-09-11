// This file has been removed as part of a request to delete the subscription feature completely
import { useAuth } from '../../contexts/AuthContext';

export const SubscriptionManagement: React.FC = () => {
  const { user, updateSubscription } = useAuth();

  const plans = [
    {
      tier: SubscriptionTier.BASIC,
      name: 'Basic',
      price: 'Free',
      icon: <Star className="w-6 h-6" />,
      features: [
        'Basic stock data analysis',
        'Limited to 5 stocks per day',
        '7-day data history',
        'Basic anomaly detection',
        'Community support'
      ],
      limitations: ['No sentiment analysis', 'No case management', 'No API access']
    },
    {
      tier: SubscriptionTier.STANDARD,
      name: 'Standard',
      price: '$29/month',
      icon: <Check className="w-6 h-6" />,
      features: [
        'Standard stock data analysis',
        'Up to 20 stocks per day',
        '30-day data history',
        'Advanced anomaly detection',
        'Social media sentiment analysis',
        'Email support'
      ],
      limitations: ['No case management', 'Limited API calls']
    },
    {
      tier: SubscriptionTier.PREMIUM,
      name: 'Premium',
      price: '$99/month',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Premium stock data analysis',
        'Unlimited stocks',
        '90-day data history',
        'Advanced anomaly detection',
        'Full sentiment analysis',
        'Case management',
        'Real-time alerts',
        'Priority support'
      ],
      limitations: ['Single user account']
    },
    {
      tier: SubscriptionTier.ENTERPRISE,
      name: 'Enterprise',
      price: 'Contact Sales',
      icon: <Building className="w-6 h-6" />,
      features: [
        'Enterprise-grade analysis',
        'Unlimited everything',
        'Full historical data',
        'Custom model training',
        'Full API access',
        'Multi-user accounts',
        'Dedicated support',
        'Regulatory reporting',
        'Custom integrations'
      ],
      limitations: []
    }
  ];

  const currentTier = user?.subscriptionTier || SubscriptionTier.BASIC;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Select the perfect plan for your market analysis needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Plan Display */}
      {user && (
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              {plans.find(p => p.tier === currentTier)?.icon}
            </div>
            <div>
              <h3 className="font-semibold text-teal-900 dark:text-teal-100">
                Current Plan: {plans.find(p => p.tier === currentTier)?.name}
              </h3>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Next billing: February 15, 2024
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentTier === plan.tier;
          const isPopular = plan.tier === SubscriptionTier.PREMIUM;
          
          return (
            <div
              key={plan.tier}
              className={`relative bg-white dark:bg-navy-800 rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                isCurrentPlan 
                  ? 'border-teal-500 shadow-lg' 
                  : isPopular
                  ? 'border-navy-500 shadow-md'
                  : 'border-gray-200 dark:border-navy-600 hover:border-teal-300 dark:hover:border-teal-700'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-navy-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-teal-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${
                  isCurrentPlan 
                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    : 'bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{plan.price}</p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="space-y-2 mb-6">
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex-shrink-0 text-gray-400">×</div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => updateSubscription(plan.tier)}
                disabled={isCurrentPlan}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isCurrentPlan
                    ? 'bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : isPopular
                    ? 'bg-navy-600 text-white hover:bg-navy-700 transform hover:scale-105'
                    : 'bg-teal-600 text-white hover:bg-teal-700 transform hover:scale-105'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : plan.tier === SubscriptionTier.ENTERPRISE ? 'Contact Sales' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-600 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing History</h3>
        
        <div className="space-y-3">
          {[
            { date: '2024-01-01', amount: '$99.00', status: 'Paid', plan: 'Premium' },
            { date: '2023-12-01', amount: '$99.00', status: 'Paid', plan: 'Premium' },
            { date: '2023-11-01', amount: '$29.00', status: 'Paid', plan: 'Standard' }
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-navy-600 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{invoice.plan} Plan</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">{invoice.amount}</p>
                <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};