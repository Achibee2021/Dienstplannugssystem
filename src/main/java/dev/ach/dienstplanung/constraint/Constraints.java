package dev.ach.dienstplanung.constraint;

import ai.timefold.solver.core.api.score.HardSoftScore;
import ai.timefold.solver.core.api.score.stream.*;
import dev.ach.dienstplanung.dto.AssignmentDto;
import dev.ach.dienstplanung.dto.EmployeeDto;
import dev.ach.dienstplanung.dto.Type;
import org.jspecify.annotations.NonNull;

import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.List;


public class Constraints implements ConstraintProvider {
    @Override
    public Constraint @NonNull [] defineConstraints(@NonNull ConstraintFactory constraintFactory) {
        return new Constraint[]{
                assignEveryShift(constraintFactory),
                employeeConflict(constraintFactory),
                chekQualification(constraintFactory),
                minimumStaffing(constraintFactory),
                maximumWorkingTime(constraintFactory),
                restTime(constraintFactory),
                checkNightShiftPreference(constraintFactory),
                checkNightShiftSequence(constraintFactory),
                checkWeekendPreference(constraintFactory),
                checkWeekendFairness(constraintFactory),
                checkDaysOff(constraintFactory),
                checkPreferredShift(constraintFactory),
                checkTogetherPreference(constraintFactory),
                ensureEveryEmployeeGetsShift(constraintFactory)
        };
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //                                                              HELPERS FUNCTION
    //--------------------------------------------------------------------------------------------------------------------------------

    private static boolean prefers(List<String> preferred, String name){
        return preferred != null && preferred.contains(name);
    }

    private static boolean wantsFree(List<DayOfWeek> freeDays, DayOfWeek day){
        return freeDays != null && freeDays.contains(day);
    }
    //----------------------------------------------------------------------------------------------------------------------------------
    //                              HARD CONSTRAINTS
    //---------------------------------------------------------------------------------------------------------------------------------

    public  Constraint assignEveryShift(ConstraintFactory constraintFactory){
        return constraintFactory.forEachIncludingUnassigned(AssignmentDto.class)
                .filter(a-> a.getEmployee() == null)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Unassigned Shift penality");
    }
    // Ein Mitarbeiter darf nicht auf zwei stationen während gleichen Arbeitszeiten eingesetzt werden.
    public Constraint employeeConflict(ConstraintFactory constraintFactory){
        return constraintFactory.forEachUniquePair(AssignmentDto.class,
                Joiners.equal(AssignmentDto::getEmployee))
                .filter((A1, A2) -> A1.getTimeslot().getDayOfWeek() == A2.getTimeslot().getDayOfWeek())
                .filter((A1, A2) -> (A1.getTimeslot().getStartTime()).isBefore(A2.getTimeslot().getEndTime()))
                .filter((A1, A2) -> (A2.getTimeslot().getStartTime()).isBefore(A1.getTimeslot().getEndTime()))
                .filter((A, B) -> !A.getStation().equals(B.getStation()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Employee Conflict");
    }
    public Constraint chekQualification(ConstraintFactory constraintFactory){

        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A1-> A1.getEmployee() != null
                && A1.getStation() != null)
                .filter((A1) -> !A1.getStation().getBenoetigtQualification().equals(A1.getEmployee().getQualification()))
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Qualification conflict");
    }
    public Constraint minimumStaffing(ConstraintFactory constraintFactory){
        return  constraintFactory.forEach(AssignmentDto.class)
                .filter(A-> A.getEmployee() == null)
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Unassigned shift penalty");
    }
    public Constraint maximumWorkingTime(ConstraintFactory constraintFactory){

        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A->A.getEmployee() != null && A.getTimeslot() != null)
                .groupBy(AssignmentDto::getEmployee, A -> A.getTimeslot().getDayOfWeek(),
                        ConstraintCollectors.sumDuration(A->
                                (Duration.between(A.getTimeslot().getStartTime(),
                                        A.getTimeslot().getEndTime()))))
                .filter((E, DoW, D)->
                        D.compareTo(E.getMaximumWorkingTime()) > 0)
                .penalize(HardSoftScore.ONE_HARD,
                        ((E, DoW, D)->
                                (D.minus(E.getMaximumWorkingTime())).toHours()))
                .asConstraint("Arbeitszeit ueberschritten conflict");

    }
    private final LocalDate referenceDate = LocalDate.of(2026,9,28);

     LocalDateTime localDateTransformation(LocalDate referenceDate, DayOfWeek dayOfWeek, LocalTime localTime){
        LocalDate day = referenceDate.with(TemporalAdjusters.nextOrSame(dayOfWeek));
        return LocalDateTime.of(day, localTime);
    }
    public Constraint restTime(ConstraintFactory constraintFactory){

        return constraintFactory.forEachUniquePair(AssignmentDto.class,
                Joiners.equal(AssignmentDto::getEmployee))
                .filter((A1,A2)->
                        A1.getEmployee() != null && A1.getTimeslot() != null
                && A2.getTimeslot() != null)
                .filter((A1, A2)->
                        A1.getTimeslot().getDayOfWeek() != A2.getTimeslot().getDayOfWeek())
                .filter((A1,A2)->{
                    Duration ruhezeit;
                    LocalDateTime start1 = localDateTransformation(referenceDate, A1.getTimeslot().getDayOfWeek(),A1.getTimeslot().getStartTime());
                    LocalDateTime end1 = localDateTransformation(referenceDate, A1.getTimeslot().getDayOfWeek(),A1.getTimeslot().getEndTime());

                    LocalDateTime start2 = localDateTransformation(referenceDate, A2.getTimeslot().getDayOfWeek(),A2.getTimeslot().getStartTime());
                    LocalDateTime end2 = localDateTransformation(referenceDate, A2.getTimeslot().getDayOfWeek(),A2.getTimeslot().getEndTime());

                    LocalDateTime earlierEnd = end1.isBefore(start2) ? end1 : end2;
                    LocalDateTime laterStart = end1.isBefore(start2) ? start2 : start1;
                    ruhezeit = Duration.between(earlierEnd, laterStart);

                    return !ruhezeit.isNegative() &&ruhezeit.compareTo(A1.getEmployee().getRuheTime()) < 0;
                })
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("ruhezeit conflict");
    }

//--------------------------------------------------------------------------------------------------------------------------------------------------
//                                             SOFT CONSTRAINTS
//--------------------------------------------------------------------------------------------------------------------------------------------------

    public Constraint ensureEveryEmployeeGetsShift(ConstraintFactory constraintFactory){
         return constraintFactory.forEach(EmployeeDto.class)
                 .ifNotExists(AssignmentDto.class,
                         Joiners.equal(EmployeeDto::getId, assignmentDto -> assignmentDto.getEmployee().getId()))
                 .penalize(HardSoftScore.ONE_SOFT)
                 .asConstraint("Every employee should have at least one shift");
    }
    public Constraint checkNightShiftPreference(ConstraintFactory constraintFactory){

        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A-> A.getTimeslot() != null &&
                        A.getTimeslot().getType() == Type.NACHTSCHICHT)
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Nachtdienst Preference");
    }
    public Constraint checkWeekendPreference(ConstraintFactory constraintFactory){
        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A-> A.getTimeslot() != null &&
                        (A.getTimeslot().getDayOfWeek() == DayOfWeek.SATURDAY
                        || A.getTimeslot().getDayOfWeek() == DayOfWeek.SUNDAY))
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Weekend preference");
    }
    public Constraint checkPreferredShift(ConstraintFactory constraintFactory){
        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A->A.getEmployee() != null && A.getTimeslot() != null
                && !A.getEmployee().getWunschSchicht().isEmpty())
                .filter(A-> !A.getEmployee().getWunschSchicht().contains(A.getTimeslot().getType()))
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Schicht preference");
    }
    public Constraint checkDaysOff(ConstraintFactory constraintFactory){
        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A->A.getEmployee() != null && A.getTimeslot() != null)
                .filter(A-> wantsFree(A.getEmployee().getWunschFreiTage(), A.getTimeslot().getDayOfWeek()))
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("wunscheFrei Tage");
    }
    public Constraint checkTogetherPreference(ConstraintFactory constraintFactory){
        return constraintFactory.forEachUniquePair(AssignmentDto.class,
                        Joiners.equal(A-> A.getTimeslot() != null
                        ? A.getTimeslot().getDayOfWeek() : null))
                .filter((A1,A2)->
                        A1.getEmployee() != null && A2.getEmployee() != null &&
                        !A1.getEmployee().equals(A2.getEmployee()))
                .filter((A1,A2)->
                        prefers(A1.getEmployee().getBevorzugtMitarbeiter(),A2.getEmployee().getName())
                &&
                        prefers(A2.getEmployee().getBevorzugtMitarbeiter(),A1.getEmployee().getName()))
                .filter((A1,A2)->
                        !A1.getTimeslot().equals(A2.getTimeslot()))
                .penalize(HardSoftScore.ONE_SOFT)
                .asConstraint("Mitarbeier preference");

    }
    public Constraint checkNightShiftSequence(ConstraintFactory constraintFactory){
        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A-> A.getEmployee() != null && A.getTimeslot() !=null &&
                        A.getTimeslot().getType() == Type.NACHTSCHICHT)
                .groupBy(AssignmentDto::getEmployee,
                        ConstraintCollectors.toConsecutiveSequences(A->
                                A.getTimeslot().getDayOfWeek().getValue()))
                .groupBy((E, C)->
                                E,
                        ConstraintCollectors.sum((E, C)->
                                (C.getConsecutiveSequences().stream()
                                        .mapToInt(seq->
                                                seq.getLength()>=3 ?
                                                        (seq.getLength() -3)
                                                        : 0).sum()
                                )))

                .filter((E, count)-> count > 0)
                .penalize(HardSoftScore.ONE_SOFT, (E, C)-> C)
                .asConstraint("Nachtsdienst Sequence");
    }
    public Constraint checkWeekendFairness(ConstraintFactory constraintFactory){

        var averageStream = constraintFactory.forEach(AssignmentDto.class)
                .filter(A->
                        A.getTimeslot().getDayOfWeek() == DayOfWeek.SATURDAY
                                || A.getTimeslot().getDayOfWeek() == DayOfWeek.SUNDAY)
                .groupBy(AssignmentDto::getEmployee, ConstraintCollectors.count())
                .groupBy(ConstraintCollectors.average((E,count)->count));

        return constraintFactory.forEach(AssignmentDto.class)
                .filter(A-> A.getTimeslot().getDayOfWeek() == DayOfWeek.SATURDAY
                        || A.getTimeslot().getDayOfWeek() == DayOfWeek.SUNDAY)
                .groupBy(AssignmentDto::getEmployee, ConstraintCollectors.count())
                .join(averageStream)
                .filter((E,count, avg)->count > avg)
                .penalize(HardSoftScore.ONE_SOFT,
                        (E,count,avg)->
                                (int) Math.ceil(count-avg))
                .asConstraint("weekend fairness");
    }



}


