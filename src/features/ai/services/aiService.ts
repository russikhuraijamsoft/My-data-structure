import { collection, query, getDocs } from 'firebase/firestore';
import { AiInsight, AiAlert, AiForecast } from '../models/ai';
import { db } from '../../../core/firebase/firebaseConfig';

class AiService {
  async getInsights(): Promise<AiInsight[]> {
    return [
      {
        id: 'ins_1',
        type: 'MENU',
        title: 'High Velocity: Chicken Chowmein',
        description: 'Chicken Chowmein accounts for 34% of lunchtime volume with steady 48% margins.',
        recommendation: 'Ensure 15kg shredded chicken is pre-marinated before the 12:00 PM rush.',
        impact: '+₹4,500 daily throughput',
        timestamp: new Date().toISOString()
      },
      {
        id: 'ins_2',
        type: 'SALES',
        title: 'Combo Adoption Increasing',
        description: 'Signature Combo conversion increased by 22% among evening dine-in guests.',
        recommendation: 'Highlight the Duo and Family combos on the counter display during 6 PM - 9 PM.',
        impact: 'Average ticket size +14%',
        timestamp: new Date().toISOString()
      }
    ];
  }

  async getAlerts(): Promise<AiAlert[]> {
    return [
      {
        id: 'alt_1',
        priority: 'MEDIUM',
        message: 'LPG consumption velocity is 8% above average for the current shift. Check burner flame settings on Station 1.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'alt_2',
        priority: 'HIGH',
        message: 'Noodle inventory approaching reorder threshold (45kg remaining). Order lead time is 24 hours.',
        timestamp: new Date().toISOString()
      }
    ];
  }

  async getForecast(): Promise<AiForecast[]> {
    return [
      { date: '26 Sep', projectedSales: 135000, projectedOrders: 112, confidence: 0.94 },
      { date: '27 Sep', projectedSales: 148000, projectedOrders: 125, confidence: 0.92 },
      { date: '28 Sep', projectedSales: 165000, projectedOrders: 140, confidence: 0.90 },
      { date: '29 Sep', projectedSales: 152000, projectedOrders: 128, confidence: 0.91 },
      { date: '30 Sep', projectedSales: 130000, projectedOrders: 108, confidence: 0.93 },
      { date: '01 Oct', projectedSales: 142000, projectedOrders: 118, confidence: 0.92 },
      { date: '02 Oct', projectedSales: 158000, projectedOrders: 132, confidence: 0.89 }
    ];
  }
}

export const aiService = new AiService();
