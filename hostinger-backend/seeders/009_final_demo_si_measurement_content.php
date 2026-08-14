<?php

declare(strict_types=1);

return static function (PDO $pdo): void {
    $source = 'NCERT Class 11 Chemistry, Unit 1: Some Basic Concepts of Chemistry, SI base units table, measurement examples, and Unit 1 exercises';
    $classId = demoFetchId($pdo, 'SELECT id FROM classes WHERE class_level = ? LIMIT 1', ['11']);
    $subjectId = $classId ? demoFetchId($pdo, 'SELECT id FROM subjects WHERE class_id = ? AND subject_type = ? LIMIT 1', [$classId, 'chemistry']) : null;
    $chapterId = $classId ? demoFetchId($pdo, 'SELECT id FROM chapters WHERE class_id = ? AND slug = ? LIMIT 1', [$classId, 'some-basic-concepts-of-chemistry']) : null;
    if (!$classId || !$subjectId || !$chapterId) {
        throw new RuntimeException('Class 11 Unit 1 structure is missing. Run earlier seeders first.');
    }

    $now = date('Y-m-d H:i:s');
    $drillId = demoFetchId($pdo, 'SELECT id FROM quick_drills WHERE slug = ? LIMIT 1', ['si-units-scientific-notation-drill']);
    if ($drillId) {
        $pdo->prepare('UPDATE quick_drills SET title = ?, description = ?, difficulty = ?, estimated_minutes = ?, status = ?, source_type = ?, source_reference = ?, updated_at = ? WHERE id = ?')
            ->execute(['SI Units & Measurement Drill', 'Source-backed Class 11 practice for SI units, conversions, precision, accuracy, and significant figures.', 'intermediate', 6, 'published', 'NCERT', $source, $now, $drillId]);
    } else {
        $pdo->prepare('INSERT INTO quick_drills (uuid, class_id, subject_id, chapter_id, title, slug, description, language, difficulty, estimated_minutes, status, source_type, source_reference, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            ->execute(['final-demo-si-units-drill', $classId, $subjectId, $chapterId, 'SI Units & Measurement Drill', 'si-units-scientific-notation-drill', 'Source-backed Class 11 practice for SI units, conversions, precision, accuracy, and significant figures.', 'en', 'intermediate', 6, 'published', 'NCERT', $source, $now, $now]);
        $drillId = (int) $pdo->lastInsertId();
    }

    $questions = [
        ['Which is the SI base unit of mass?', ['gram (g)', 'kilogram (kg)', 'milligram (mg)'], 'kilogram (kg)', 'The SI base unit of mass is kilogram, symbol kg.', 'si_mass_base_unit', 'adapted'],
        ['Which unit measures amount of substance?', ['mole (mol)', 'kilogram (kg)', 'candela (cd)'], 'mole (mol)', 'Amount of substance is an SI base quantity. Its unit is mole, symbol mol.', 'si_amount_unit', 'adapted'],
        ['Choose the correct symbol for kelvin.', ['K', '°K', 'k'], 'K', 'Kelvin uses the symbol K. The SI symbol has no degree sign.', 'si_kelvin_symbol', 'adapted'],
        ['Complete the bridge: 1 km equals how many millimetres?', ['10³ mm', '10⁶ mm', '10⁹ mm'], '10⁶ mm', '1 km = 10³ m and 1 m = 10³ mm, so 1 km = 10⁶ mm.', 'conversion_prefix_chain', 'adapted'],
        ['Convert 1 mg into kilograms.', ['10⁻³ kg', '10⁻⁶ kg', '10⁻⁹ kg'], '10⁻⁶ kg', '1 mg = 10⁻³ g and 1 g = 10⁻³ kg, therefore 1 mg = 10⁻⁶ kg.', 'conversion_mg_kg', 'adapted'],
        ['Student A readings are tightly grouped but away from the true value. What are they?', ['Precise but not accurate', 'Accurate but not precise', 'Both accurate and precise'], 'Precise but not accurate', 'Close repeated readings show precision; distance from the true value shows lack of accuracy.', 'precision_accuracy_confusion', 'adapted'],
        ['Round 34.216 to three significant figures.', ['34.2', '34.3', '34.21'], '34.2', 'Keep 3, 4, 2. The next digit is 1, so 34.2 stays unchanged.', 'sigfig_rounding', 'exact'],
        ['Round 10.4107 to three significant figures.', ['10.4', '10.5', '10.41'], '10.4', 'The first three significant digits are 1, 0, and 4. The next digit is 1, so the result is 10.4.', 'sigfig_zero_between', 'exact'],
        ['Report 12.11 + 18.0 + 1.012 using the addition rule.', ['31.122', '31.12', '31.1'], '31.1', 'For addition, keep the least number of decimal places. The result is 31.1.', 'sigfig_addition_rule', 'exact'],
        ['Report 2.5 × 1.25 using the multiplication rule.', ['3.125', '3.13', '3.1'], '3.1', 'For multiplication, keep the fewest significant figures. The result is 3.1.', 'sigfig_multiplication_rule', 'exact'],
        ['Which is 0.04597 rounded to three significant figures?', ['0.0460', '0.0459', '0.046'], '0.0460', 'Leading zeros are not significant; the final zero records the third significant figure.', 'sigfig_leading_zeros', 'exact'],
        ['How many picometres are in 1 km?', ['10⁹ pm', '10¹² pm', '10¹⁵ pm'], '10¹⁵ pm', '1 km = 10³ m and 1 m = 10¹² pm, so 1 km = 10¹⁵ pm.', 'conversion_km_pm', 'adapted'],
    ];

    $pdo->beginTransaction();
    try {
        $pdo->prepare('DELETE FROM quiz_questions WHERE drill_id = ?')->execute([$drillId]);
        $insert = $pdo->prepare('INSERT INTO quiz_questions (drill_id, class_id, subject_id, chapter_id, topic_id, question_text, question_type, options_json, correct_answer_json, explanation, hint, difficulty, mistake_type, source_reference, order_index, status, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        foreach ($questions as $index => $question) {
            [$prompt, $options, $answer, $explanation, $mistake, $kind] = $question;
            $insert->execute([$drillId, $classId, $subjectId, $chapterId, $prompt, 'mcq', json_encode($options, JSON_UNESCAPED_UNICODE), json_encode([$answer], JSON_UNESCAPED_UNICODE), $explanation, 'Use the SI definition or operation rule before calculating.', 'intermediate', $mistake, $source . ' (' . $kind . ')', $index + 1, 'published', $now, $now]);
        }
        $pdo->commit();
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $error;
    }
};

function demoFetchId(PDO $pdo, string $sql, array $params): ?int
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $value = $statement->fetchColumn();
    return $value === false ? null : (int) $value;
}
