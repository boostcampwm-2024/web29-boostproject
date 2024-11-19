export const Websocket = {
  Status: {
    NORMAL_CLOSURE: 1000,
    GOING_AWAY: 1001,
    PROTOCOL_ERROR: 1002,
    UNSUPPORTED_DATA: 1003,
    RESERVED: 1004,
    NO_STATUS_RECEIVED: 1005,
    ABNORMAL_CLOSURE: 1006,
    INVALID_FRAME_PAYLOAD: 1007,
    POLICY_VIOLATION: 1008,
    MESSAGE_TOO_BIG: 1009,
    MANDATORY_EXTENSION: 1010,
    INTERNAL_SERVER_ERROR: 1011,
    SERVICE_RESTART: 1012,
    TRY_AGAIN_LATER: 1013,
    BAD_GATEWAY: 1014,
    TLS_HANDSHAKE_FAILURE: 1015,
  },

  Descriptions: {
    1000: 'Normal Closure: 연결이 정상적으로 종료되었습니다.',
    1001: 'Going Away: 클라이언트 또는 서버가 종료되었습니다.',
    1002: 'Protocol Error: 프로토콜 위반으로 연결이 종료되었습니다.',
    1003: 'Unsupported Data: 지원되지 않는 데이터 유형입니다.',
    1004: 'Reserved: 예약된 상태 코드입니다.',
    1005: 'No Status Received: 상태 코드가 지정되지 않았습니다.',
    1006: 'Abnormal Closure: 비정상적으로 연결이 종료되었습니다.',
    1007: 'Invalid Frame Payload: 잘못된 페이로드 형식입니다.',
    1008: 'Policy Violation: 정책 위반으로 연결이 종료되었습니다.',
    1009: 'Message Too Big: 메시지 크기가 제한을 초과했습니다.',
    1010: 'Mandatory Extension: 필수 확장을 지원하지 않습니다.',
    1011: 'Internal Server Error: 서버 내부 오류로 인해 연결이 종료되었습니다.',
    1012: 'Service Restart: 서비스가 재시작되었습니다.',
    1013: 'Try Again Later: 나중에 다시 시도하십시오.',
    1014: 'Bad Gateway: 게이트웨이 문제로 연결이 종료되었습니다.',
    1015: 'TLS Handshake Failure: TLS 핸드셰이크가 실패했습니다.',
  },
};
