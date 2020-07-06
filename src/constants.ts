export const NUMBER = "number";

export const GRID = "grid";
export const ROW = "row";
export const COLUMN = "column";
export const PRIMITIVES = ["circle", "square", "slash"] as const;
export const NONE = "None";

// === PLANE === //
export const AVERAGE = "Average";
export const CANVAS = "Canvas";
export const CANVAS_GENERATIVE = "Canvas (Generative)";
export const SHAPE = "Shape";
export const THREE_JS = "3D";
export const SURVEY_CANVAS = "Survey Canvas (in development)"

// === CONFIGURATION === //

export const CONFIGURATION = "Configuration";

// === SURVEY === //
export const SURVEY = "Survey";

// === DEFAULT === //
export const DEFAULT_CONFIG = "Default configuration";

export const ANCHOR_POINT = "Anchor point";
export const X = "X";
export const Y = "Y";
export const CARTESIAN = [X, Y] as const;
export const [SET_X, SET_Y] = CARTESIAN.map(coordinate => `set_${coordinate}`);

export const NUM_LINES = "Lines";
export const SET_NUM_LINES = "set_num_lines";

export const DELAY = "Delay (x 100ms)";
export const SET_DELAY = "set_delay";

export const MATRIX_DIMENSIONS = "Matrix dimensions";
export const M = "m";
export const N = "n";
export const DIMENSIONS = [M, N] as const;
export const [SET_M, SET_N] = DIMENSIONS.map(dim => `set_${dim}`);

export const DATA_FORMAT = "Data format (0=points, 1=deltas)";
export const SET_DATA_FORMAT = "set_data_format";

// VERBS
export const VERBS = "Verbs";

// === DATA FORMATTING === //
export const RESET_DATA = "reset_data";

export const POINT = "Point";
export const POINTS = "Points";
export const NUM_POINTS = "Number of points";
export const ADD_POINT = "add_point";
export const SET_LAST_POINT = "add_delta";

export const TIMESTAMP = "Timestamp";
export const TIMESTAMPS = "Timestamps";
export const ADD_TIMESTAMP = "add_timestamp";
export const DELETE_TIMESTAMPS = "delete_timestamps";

export const SEGMENTS = "Segments";
export const NUM_SEGMENTS = "Number of segments";
export const ADD_SEGMENT = "add_segment";
export const SET_NUM_SEGMENTS = "set_num_points";

export const AVERAGE_X = "Average X";
export const AVERAGE_Y = "Average Y";

export const DELTA_X = "Delta (x)";
export const DELTA_Y = "Delta (y)";

// TRANSFORMATIONS
export const TRANSFORMATION = "Transformation";
export const TRANSFORMATIONS = "Transformations";
export const ADD_TRANSFORMATION = "add_transformation";
export const SET_TRANSFORMATION = "set_transformation";
export const SET_TRANSFORMATIONS = "set_transformations";

export const INDEX_BASED = "Index based";
export const SET_INDEX_BASED = "set_index_based";
export const DISTANCE = "Distance";
export const SET_DISTANCE = "set_distance";

export const [ADD_RULE, DELETE_RULE, EDIT_RULE] = ["add", "delete", "edit"].map(
  action => `${action}_rule`
);

export const MOVE_TO = "move_to";
export const LINE_TO = "line_to";

// TRANSFORM PRESETS
export const ARC = "arc";
export const CIRCLE = "circle";
export const SCALE_X = "scale_x";
export const SCALE_Y = "scale_y";
export const SQUARE = "square";
export const TANGENT_LINE = "tangent_line";
export const TREE = "tree";

// WAVES
export const SIN = "sin";
export const COS = "cos";
export const AMPLITUDE = "Amplitude";
export const FREQUENCY = "Frequency";
export const SET_AMPLITUDE = "set_amplitude";
export const SET_FREQUENCY = "set_frequency";

// SEGMENT
export const SEGMENT = "Segment";

// FILTERS - not being used
export const FILTER = "Filter";
export const FILTERS = "Filters";

export const BLUR = "Blur";
export const BRIGHTNESS = "Brightness";
export const CONTRAST = "Contrast";
export const DROP_SHADOW = "Drop shadow";
export const GRAYSCALE = "Grayscale";
export const HUE_ROTATION = "Hue rotation";
export const INVERT = "Invert";
export const OPACITY = "Opacity";
export const SATURATE = "Saturate";
export const SEPIA = "Sepia";
export const URL = "URL";

export const NOISE_FILTERS = "Noise filters";
