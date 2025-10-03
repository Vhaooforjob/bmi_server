const AF = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };

function round5(x){ return Math.round(x/5)*5; }
function bmiClass(bmi){
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

/**
 * input: { height_cm, weight_kg, age_years, sex('male'|'female'|'average'), activity }
 * output: { bmi, bmi_class, bmr_kcal, tdee_kcal, meals[{id,name,percent,kcal}] }
 */
function calcKcal({
        height_cm, weight_kg, age_years = 25, sex = 'average', activity = 'sedentary',
        meal_split = [30,40,30]
    }) {
        const height_m = height_cm / 100;
        const bmi = +(weight_kg / (height_m * height_m)).toFixed(2);
        const sexOffset = sex === 'male' ? 5 : sex === 'female' ? -161 : -78;
        const bmr = 10*weight_kg + 6.25*height_cm - 5*age_years + sexOffset;
        const tdee = bmr * (AF[activity] || 1.2);

        const sum = meal_split.reduce((a,b)=>a+b,0) || 100;
        const norm = meal_split.map(p => p * 100 / sum);
        const ids   = ['breakfast','lunch','dinner','snack'];
        const names = ['Bữa sáng','Bữa trưa','Bữa tối','Bữa phụ'];

        const meals = norm.map((p,i)=>({
            id: ids[i] || `meal_${i+1}`,
            name: names[i] || `Bữa ${i+1}`,
            percent: +p.toFixed(2),
            kcal: round5(tdee * (p/100))
    }));

    return {
        bmi,
        bmi_class: bmiClass(bmi),
        bmr_kcal: Math.round(bmr),
        tdee_kcal: Math.round(tdee),
        meals
    };
}

module.exports = { calcKcal };