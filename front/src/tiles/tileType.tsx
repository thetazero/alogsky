import React from "react";
import { TrainingDataSet } from "../analysis/analysis";

type panelComponentType = React.FC<{ dataset: TrainingDataSet, id: string, data?: any }>;

export default panelComponentType;
