describe('maintenance notice', () => {
  const env = { ...process.env }

  beforeEach(() => {
    jest.resetModules()
    // Pretend we're in an app dev build, not under Jest
    process.env = { ...env, NODE_ENV: 'development' }
    delete process.env.JEST_WORKER_ID
    ;(global as any).__DEV__ = true
  })

  afterEach(() => {
    process.env = env
    jest.restoreAllMocks()
  })

  it('warns once per session and points to the fork', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { showMaintenanceNotice } = require('../maintenanceNotice')

    showMaintenanceNotice()
    showMaintenanceNotice()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('https://github.com/kesha-antonov/react-native-chat')
  })

  it('stays quiet after disableMaintenanceNotice()', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { showMaintenanceNotice, disableMaintenanceNotice } = require('../maintenanceNotice')

    disableMaintenanceNotice()
    showMaintenanceNotice()

    expect(warn).not.toHaveBeenCalled()
  })

  it('stays quiet in production builds', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    ;(global as any).__DEV__ = false
    const { showMaintenanceNotice } = require('../maintenanceNotice')

    showMaintenanceNotice()

    expect(warn).not.toHaveBeenCalled()
  })
})
