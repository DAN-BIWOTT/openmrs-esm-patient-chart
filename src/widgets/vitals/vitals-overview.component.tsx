import React from "react";
import SummaryCard from "../cards/summary-card.component";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import styles from "./vitals-overview.css";
import { formatDate } from "../heightandweight/heightandweight-helper";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCardFooter from "../cards/summary-card-footer.component";

export default function VitalsOverview(props: VitalsOverviewProps) {
  const [patientVitals, setPatientVitals] = React.useState(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  React.useEffect(() => {
    const subscription = performPatientsVitalsSearch(patientUuid).subscribe(
      vitals => setPatientVitals(vitals),
      createErrorHandler()
    );

    return () => subscription.unsubscribe();
  }, [patientUuid]);

  return (
    <SummaryCard
      name="Vitals"
      styles={{ width: "100%" }}
      link={`/patient/${patientUuid}/chart/vitals`}
    >
      <table className={styles.vitalsTable}>
        <thead>
          <tr className="omrs-bold">
            <td></td>
            <td>BP</td>
            <td>Rate</td>
            <td>Oxygen</td>
            <td colSpan={2}>Temp</td>
          </tr>
        </thead>
        <tbody>
          {patientVitals &&
            patientVitals.map((vitals, index) => {
              return (
                <React.Fragment key={vitals.id}>
                  <tr>
                    <td>{formatDate(vitals.date)}</td>
                    <td>
                      {`${vitals.systolic} / ${vitals.diastolic}`}
                      {index === 0 && <span> mmHg</span>}
                    </td>
                    <td>
                      {vitals.pulse} {index === 0 && <span>bpm</span>}
                    </td>
                    <td>
                      {vitals.oxygenation} {index === 0 && <span>%</span>}
                    </td>
                    <td>
                      {vitals.temperature}
                      {index === 0 && <span> &#8451;</span>}
                    </td>
                    <td>
                      <svg
                        className="omrs-icon"
                        fill="var(--omrs-color-ink-low-contrast)"
                      >
                        <use xlinkHref="#omrs-icon-chevron-right" />
                      </svg>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
      <SummaryCardFooter linkTo={`/patient/${patientUuid}/chart/vitals`} />
    </SummaryCard>
  );
}

type VitalsOverviewProps = {};
