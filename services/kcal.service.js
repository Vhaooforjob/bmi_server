const KcalRecord = require('../models/kcalRecord.model');
const { calcKcal } = require('../utils/kcal');

class KcalService {
  static _normalizeMealSplit(meal_split) {
    if (Array.isArray(meal_split) && typeof meal_split[0] === 'number') {
      const ids = ['breakfast','lunch','dinner','snack'];
      const names = ['Bữa sáng','Bữa trưa','Bữa tối','Bữa phụ'];
      return meal_split.map((p,i)=>({ id: ids[i]||`meal_${i+1}`, name: names[i]||`Bữa ${i+1}`, percent: p }));
    }
    return meal_split;
  }

  static _calcFromInput({ height_cm, weight_kg, age_years, sex, activity, meal_split }) {
    const splitPercents = (meal_split || [30,40,30]).map(x => typeof x === 'number' ? x : x.percent);
    return calcKcal({ height_cm, weight_kg, age_years, sex, activity, meal_split: splitPercents });
  }

  static async createOrReplace(data, userId = null) {
    const { height_cm, weight_kg, age_years, sex, activity, meal_split } = data;
    if (!height_cm || !weight_kg) throw new Error('height_cm & weight_kg là bắt buộc');

    const mealSplitArr = this._normalizeMealSplit(meal_split);
    const result = this._calcFromInput({ height_cm, weight_kg, age_years, sex, activity, meal_split: mealSplitArr });

    if (userId) {
      await KcalRecord.deleteMany({ userId });
    }

    return await KcalRecord.create({
      userId: userId || data.userId || undefined,
      height_cm, weight_kg, age_years, sex, activity,
      meal_split: mealSplitArr || [],
      bmi: result.bmi,
      bmi_class: result.bmi_class,
      bmr_kcal: result.bmr_kcal,
      tdee_kcal: result.tdee_kcal,
      meals: result.meals
    });
  }

  static async listRecords({ userId } = {}) {
    const q = userId ? { userId } : {};
    return await KcalRecord.find(q).sort({ createdAt: -1 }).lean();
  }

  static async getRecordById(id) {
    return await KcalRecord.findById(id).lean();
  }

  static async getRecordByUserId(userId) {
    if (!userId) throw new Error('userId là bắt buộc');
    return await KcalRecord.findOne({ userId }).lean();
  }

  static async updateRecord(id, data) {
    const old = await KcalRecord.findById(id);
    if (!old) throw new Error('Not found');

    const { height_cm, weight_kg, age_years, sex, activity, meal_split } = data;
    const newInput = {
      height_cm: height_cm ?? old.height_cm,
      weight_kg: weight_kg ?? old.weight_kg,
      age_years: age_years ?? old.age_years,
      sex:       sex ?? old.sex,
      activity:  activity ?? old.activity
    };

    let splitPercent = (meal_split ?? (old.meal_split?.map(m=>m.percent) || [30,40,30]));
    if (Array.isArray(meal_split) && typeof meal_split[0] !== 'number') {
      splitPercent = meal_split.map(m => m.percent);
    }

    const result = calcKcal({ ...newInput, meal_split: splitPercent });

    const ids = ['breakfast','lunch','dinner','snack'];
    const names = ['Bữa sáng','Bữa trưa','Bữa tối','Bữa phụ'];
    const mealSplitArr = splitPercent.map((p,i)=>({ id: ids[i]||`meal_${i+1}`, name: names[i]||`Bữa ${i+1}`, percent: p }));

    old.set({
      ...newInput,
      meal_split: mealSplitArr,
      bmi: result.bmi,
      bmi_class: result.bmi_class,
      bmr_kcal: result.bmr_kcal,
      tdee_kcal: result.tdee_kcal,
      meals: result.meals
    });
    return await old.save();
  }

  static async deleteRecord(id) {
    return await KcalRecord.findByIdAndDelete(id);
  }
}

module.exports = KcalService;
