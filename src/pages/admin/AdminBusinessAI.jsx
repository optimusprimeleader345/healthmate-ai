import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import {
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Clock,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Calculator,
  Lightbulb
} from 'lucide-react';

// Mock business AI services
const businessAIService = {
  // Strategic planning - comprehensive business strategy
  generateStrategicPlan: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Strategic Business Plan Generated!\n\n📈 STRATEGIC OBJECTIVES:\n✅ Revenue Target: $15M by Q2 2026\n✅ User Growth: 100K active users by end of year\n✅ Market Expansion: 5 new countries in 6 months\n✅ Product Roadmap: 8 new AI features by Q1\n\n🎯 KEY INITIATIVES:\n• Enterprise partnerships for 30% revenue\n• AI automation for 50% cost reduction\n• International expansion phase 1\n• Premium subscription optimization\n\n📊 FINANCIAL PROJECTIONS:\n• Current MRR: $8.9M\n• Year-end projection: $18.2M (+104% YoY)\n• Profitability target: 35% margin\n• Break-even: Q4 2025\n\n🚀 EXECUTION ROADMAP:\nPhase 1: Infrastructure scaling (Q1)\nPhase 2: International expansion (Q2)\nPhase 3: AI feature rollouts (Q3)\nPhase 4: Revenue optimization (Q4)\n\n📋 Plan delivered to executive dashboard');
        resolve();
      }, 3000);
    });
  },

  // Market analysis - competitive and market intelligence
  performMarketAnalysis: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('AI Market Intelligence Report Complete!\n\n🏷️ MARKET ANALYSIS SUMMARY:\n\n🎯 TOTAL MARKET SIZE: $42B (HealthTech AI)\n📈 CAGR: 18.7% (2025-2030)\n💰 OUR MARKET SHARE: 2.3% (Growing to 8.2%)\n\n🏆 TOP COMPETITIVE ADVANTAGES:\n• Proprietary AI health prediction models\n• Integrated telemedicine ecosystem\n• Real-time global health monitoring\n• Multi-language international support\n\n🎯 KEY OPPORTUNITIES:\n• Elderly care market: $15B opportunity\n• Enterprise partnerships: $8B potential\n• Africa/Middle East expansion: $5B untapped\n• AI drug discovery collaboration: $3B market\n\n⚠️ COMPETITIVE THREATS:\n• Big Tech (Google, Apple) entering space\n• Regional players capturing local markets\n• Healthcare regulations limiting growth\n• Data privacy concerns rising\n\n🎯 RECOMMENDED ACTIONS:\n🟡 Speed up international expansion programs\n🟠 Increase partnership development budget\n🔴 Launch elderly care focused AI features\n🔴 Develop stronger data compliance practices\n\n📊 Competitive position: Strong leadership in AI-driven healthcare technology');
        resolve();
      }, 2500);
    });
  },

  // Business optimization - AI-driven business improvement
  optimizeBusinessOperations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('AI Business Optimization Complete!\n\n🧠 INTELLIGENT BUSINESS OPTIMIZATIONS APPLIED:\n\n💰 REVENUE OPTIMIZATION:\n✅ Premium subscription pricing: +12% revenue\n✅ User lifetime value prediction: 94% accuracy\n✅ Personalized upsell recommendations: +28% conversion\n✅ Dynamic pricing for enterprise clients: +15% margin\n\n👥 USER EXPERIENCE IMPROVEMENTS:\n✅ AI-powered onboarding: 45% faster user activation\n✅ Predictive user churn prevention: 78% accuracy\n✅ Automated customer support: 67% ticket resolution\n✅ Personalized health recommendations: +32% engagement\n\n⚡ OPERATIONAL EFFICIENCY:\n✅ Automated report generation: 94% time saved\n✅ Intelligent resource allocation: 31% cost reduction\n✅ Predictive maintenance: 89% downtime prevented\n✅ Supply chain optimization: 23% inventory efficiency\n\n🌍 GLOBAL EXPANSION:\n✅ Market entry prioritization: Africa first (45% confidence)\n✅ Localization automation: 28 languages ready\n✅ Cultural adaptation AI: Regional content optimization\n✅ International compliance analysis: 12 countries cleared\n\n📊 PERFORMANCE METRICS:\n• Overall Revenue Increase: +34%\n• Operational Cost Reduction: -28%\n• User Satisfaction Score: +41%\n• Customer Retention Rate: +56%\n• Time to Market: -67% for new features\n\n✨ Business operations now running at peak AI-optimized efficiency');
        resolve();
      }, 4500);
    });
  },

  // Business insights details - drill-down analysis
  getInsightDetails: async (insightId, insightType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const insights = {
          revenue: '📊 Revenue Analysis:\nThe $245K spike represents a 28% increase from premium subscription upgrades.\n\n💡 Key Drivers:\n• 156 new enterprise accounts\n• 45% premium conversion rate\n• AI-personalized pricing models showing 94% success\n• Seasonal healthcare awareness campaigns\n\n🔮 Projections:\n• Q4 sustained growth at 23% MoM\n• Enterprise contracts to drive 35% of revenue\n• International markets adding 15% contribution\n\n🎯 Optimization Recommendations:\n• Expand enterprise sales team by 25%\n• Launch premium feature bundles\n• Implement dynamic pricing model',
          users: '👥 User Engagement Analysis:\n45% increase in daily active users due to new AI features.\n\n📈 User Behavior Trends:\n• Symptom checker usage: +67%\n• AI health coach interactions: +89%\n• Telemedicine consultations: +34%\n• Medication adherence tracking: +52%\n\n🎯 Engagement Optimization:\n• Push notifications effectiveness: +45%\n• Feature discovery assistance needed: +28%\n• Onboarding completion rate: 78%\n• Feature adoption targeting: AI personalized',
          efficiency: '💰 Cost Optimization Insights:\nAI identified $125K annual infrastructure savings.\n\n⚡ Efficiency Gains:\n• Server utilization optimization: 23% better\n• Storage compression algorithms: 31% reduction\n• Network bandwidth optimization: 18% savings\n• CDN cache improvements: 45% better performance\n\n🎯 Implementation Plan:\n1. Auto-scaling policies deployment\n2. Storage tier optimization\n3. Network routing improvements\n4. Real-time monitoring dashboards',
          market: '🌍 Market Opportunity Identified:\nElderly population (65+) represents $15B untapped opportunity.\n\n📊 Demographics Analysis:\n• 65+ population: 1.1B globally (up 87% since 2000)\n• Healthcare spending per elderly: $8K annually\n• Tech adoption rate: 78% smartphone usage\n• Digitally underserved: 56% of elderly population\n\n🎯 Market Entry Strategy:\n• Voice-activated AI assistants for elderly\n• Fall detection and emergency response\n• Simplified interface design principles\n• Caregiver family coordination features\n• Medical alert integration systems'
        };

        alert(`AI Business Insight Analysis\n\n${insights[insightType]} \n\n🎯 Action Items Identified:\n• Assigned to relevant department\n• Timeline: 2-week implementation\n• ROI Projection: High confidence\n• Risk Assessment: Low risk`);
        resolve();
      }, 2000);
    });
  },

  // Business intelligence aggregator
  generateBusinessIntelligenceReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Complete Business Intelligence Report\n\n🏢 EXECUTIVE SUMMARY:\n\n📊 FINANCIAL PERFORMANCE:\n• Current MRR: $8.9M\n• YoY Growth: +123%\n• Gross Margin: 68%\n• Customer LTV/CAC: 7.8\n• Churn Rate: 8.4%\n\n👥 CUSTOMER METRICS:\n• Total Users: 54,320\n• Active Users: 32,150\n• Premium Users: 8,940\n• Cust. Satisfaction: 4.7/5\n• NPS Score: +72\n\n⚡ PRODUCT METRICS:\n• Feature Usage Rate: 94%\n• AI Recommendation CTR: 67%\n• Telemed Consultation Rate: 23%\n• Mobile App Retention: 87%\n\n🚀 GROWTH OPPORTUNITIES:\n• Enterprise Market: $12B opportunity\n• International Expansion: Asia (+$5B)\n• AI Feature Monetization: +$3B potential\n• Healthcare Partnerships: +$2B value\n\n⚠️ KEY RISKS & MITIGATIONS:\n• Regulatory Changes: Compliance team monitoring\n• Competition: First-mover advantage maintained\n• Technology Evolution: R&D investment increased\n• Economic Downturn: Diversified revenue streams\n\n🎯 STRATEGIC ROADMAP:\nQ1 2026: Enterprise focus\nQ2 2026: International expansion\nQ3 2026: AI feature expansion\nQ4 2026: IPO preparation\n\n💾 Report delivered to all executive dashboards');
        resolve();
      }, 4000);
    });
  }
};

const BusinessPanel = ({ title, value, unit, icon: Icon, change, status, color = 'blue' }) => {
  const colors = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-100' },
    green: { bg: 'bg-green-500', text: 'text-green-100' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-100' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-100' },
    red: { bg: 'bg-red-500', text: 'text-red-100' }
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${colors[color].bg} to-gray-700 text-white border-0`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${colors[color].text} mb-1`}>{title}</p>
          <p className="text-3xl font-bold mb-1">{value}{unit}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {change >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-300" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-300" />
              )}
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
          {status && (
            <p className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${
              status === 'optimal' ? 'bg-green-500' :
              status === 'growth' ? 'bg-blue-500' :
              status === 'attention' ? 'bg-yellow-500' :
              'bg-gray-600'
            }`}>
              {status}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default function AdminBusinessAI() {
  const [businessMetrics, setBusinessMetrics] = useState({
    revenue: {
      monthly: 8924000,
      growth: 23.5,
      target: 10000000,
      projection: 14500000
    },
    users: {
      total: 54320,
      active: 32150,
      premium: 8940,
      growth: 12.3,
      retention: 87.6
    },
    operations: {
      efficiency: 94.2,
      costSavings: 1250000,
      automateTasks: 1567,
      responseTime: 1.2
    },
    insights: [
      { id: 1, type: 'revenue', title: 'Revenue spike detected', detail: '$245k increase from premium subscriptions', impact: 'high', time: '2 hours ago' },
      { id: 2, type: 'users', title: 'User engagement peak', detail: '45% increase in daily active users', impact: 'medium', time: '5 hours ago' },
      { id: 3, type: 'efficiency', title: 'Cost optimization', detail: 'AI recommended 12% infrastructure savings', impact: 'high', time: '8 hours ago' },
      { id: 4, type: 'market', title: 'Market opportunity', detail: 'Untapped elderly population segment identified', impact: 'medium', time: '12 hours ago' }
    ]
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isAnalyzingMarket, setIsAnalyzingMarket] = useState(false);
  const [isOptimizingBusiness, setIsOptimizingBusiness] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate business metrics updates
      setBusinessMetrics(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          monthly: prev.revenue.monthly + Math.floor(Math.random() * 50000 - 25000)
        },
        users: {
          ...prev.users,
          active: Math.max(0, prev.users.active + Math.floor(Math.random() * 100 - 50))
        }
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const revenueProgress = (businessMetrics.revenue.monthly / businessMetrics.revenue.target) * 100;
  const premiumConversion = (businessMetrics.users.premium / businessMetrics.users.total) * 100;

  // Handle strategic plan button
  const handleStrategicPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      await businessAIService.generateStrategicPlan();
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Handle market analysis button
  const handleMarketAnalysis = async () => {
    setIsAnalyzingMarket(true);
    try {
      await businessAIService.performMarketAnalysis();
    } finally {
      setIsAnalyzingMarket(false);
    }
  };

  // Handle business optimization button
  const handleOptimizeBusiness = async () => {
    setIsOptimizingBusiness(true);
    try {
      await businessAIService.optimizeBusinessOperations();
    } finally {
      setIsOptimizingBusiness(false);
    }
  };

  // Handle insight details button
  const handleViewInsightDetails = async (insight) => {
    await businessAIService.getInsightDetails(insight.id, insight.type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business AI Autopilot</h1>
          <p className="text-gray-600 mt-1">Real-time business AI optimization</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last analysis</p>
          <p className="text-lg font-medium text-gray-900">{lastUpdated.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BusinessPanel
          title="Monthly Revenue"
          value={`$${(businessMetrics.revenue.monthly / 1000000).toFixed(1)}M`}
          unit=""
          icon={DollarSign}
          change={businessMetrics.revenue.growth}
          color="green"
        />
        <BusinessPanel
          title="Active Users"
          value={businessMetrics.users.active.toLocaleString()}
          unit=""
          icon={Users}
          change={businessMetrics.users.growth}
          color="blue"
        />
        <BusinessPanel
          title="Premium Users"
          value={businessMetrics.users.premium.toLocaleString()}
          unit=""
          icon={Award}
          change={15.2}
          color="purple"
        />
        <BusinessPanel
          title="Operations Efficiency"
          value={businessMetrics.operations.efficiency}
          unit="%"
          icon={Zap}
          change={2.1}
          color="orange"
        />
      </div>

      {/* AI Business Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Revenue Targets & Projections
          </h3>

          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Current Progress</span>
                <span className="text-lg font-bold text-green-600">{revenueProgress.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Towards $10M monthly target</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.min(revenueProgress, 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${(businessMetrics.revenue.monthly / 1000000).toFixed(1)}M</span>
                <span>$10M</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">AI Projection</span>
                <span className="text-lg font-bold text-blue-600">${(businessMetrics.revenue.projection / 1000000).toFixed(1)}M</span>
              </div>
              <p className="text-sm text-gray-600">Projected next quarter (AI-optimized)</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Premium Conversion</span>
                <span className="text-lg font-bold text-purple-600">{premiumConversion.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-gray-600">Premium user rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            AI Business Insights
          </h3>

          <div className="space-y-4">
            {businessMetrics.insights.map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-500' :
                    insight.impact === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.detail}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{insight.time}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewInsightDetails(insight)}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Operational Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Cost Optimization
          </h3>

          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">${(businessMetrics.operations.costSavings / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600">Cost savings achieved</p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cloud costs</span>
              <span className="font-medium text-green-600">↓15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Processing time</span>
              <span className="font-medium text-green-600">↓23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Support tickets</span>
              <span className="font-medium text-green-600">↓31%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            AI Automation
          </h3>

          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-2">{businessMetrics.operations.automateTasks.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Tasks automated daily</p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Customer support</span>
              <span className="font-medium text-blue-600">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data processing</span>
              <span className="font-medium text-blue-600">89%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Report generation</span>
              <span className="font-medium text-blue-600">94%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Growth Opportunities
          </h3>

          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">Market Expansion</span>
                <span className="text-sm font-bold text-orange-600">87%</span>
              </div>
              <p className="text-xs text-gray-600">Confidence level</p>
            </div>

            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">Partnership ROI</span>
                <span className="text-sm font-bold text-green-600">92%</span>
              </div>
              <p className="text-xs text-gray-600">Projected return</p>
            </div>

            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">Feature Adoption</span>
                <span className="text-sm font-bold text-blue-600">94%</span>
              </div>
              <p className="text-xs text-gray-600">User adoption rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Business AI Control Center */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Business Intelligence Hub</h3>
            <p className="text-sm text-gray-600">Intelligent business optimization and growth strategies</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStrategicPlan}
              disabled={isGeneratingPlan}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              {isGeneratingPlan ? 'Planning...' : 'Strategic Plan'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarketAnalysis}
              disabled={isAnalyzingMarket}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {isAnalyzingMarket ? 'Analyzing...' : 'Market Analysis'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOptimizeBusiness}
              disabled={isOptimizingBusiness}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isOptimizingBusiness ? 'Optimizing...' : 'Optimize Business'}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${(businessMetrics.revenue.projection / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-gray-600">Revenue Projection</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{businessMetrics.operations.automateTasks.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Automated Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{businessMetrics.users.retention}%</p>
            <p className="text-sm text-gray-600">User Retention</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">156</p>
            <p className="text-sm text-gray-600">AI Models Active</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
