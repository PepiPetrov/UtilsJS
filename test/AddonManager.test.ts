import { AddonManager } from '../src';

class TestAddon {
  testProp: string;
  constructor() {
    this.testProp = 'test';
  }

  testMethod() {
    return this.testProp;
  }
}

class TestDependency {
  dependencyProp: string = 'dependency';
}

class TestAddonWithDependency {
  dependencies: any[] = [TestDependency];
  dependentProp: string = 'dependent';
}

describe('AddonManager', () => {
  let addonManager: AddonManager<any>;

  beforeEach(() => {
    addonManager = new AddonManager();
  });

  test('getEntries should return an array of addon entries', () => {
    addonManager.addAddon(TestAddon, 'TestAddon');
    const entries = addonManager.getEntries();
    expect(entries.length).toBe(1);
    expect(entries[0][0]).toBe('TestAddon');
    expect(entries[0][1]).toBe(TestAddon);
  });

  test('addAddon should add an addon to the addons map and addonClasses map', () => {
    addonManager.addAddon(TestAddon, 'TestAddon');
    expect(addonManager.addons.has('TestAddon')).toBe(true);
    expect(addonManager.addonClasses.has('TestAddon')).toBe(true);
  });

  test('addAddon should add instance properties to the addon', () => {
    addonManager.addAddon(TestAddon, 'TestAddon');
    const testAddonInstance = addonManager.addons.get('TestAddon');
    expect(testAddonInstance.testProp).toBe('test');
  });

  test('addAddon should add dependencies to the addon', () => {
    addonManager.addAddon(TestAddonWithDependency, 'TestAddonWithDependency');
    expect(addonManager.dependentProp).toBe('dependent');
    expect(addonManager.dependencyProp).toBe('dependency');
  });

  test('removeAddon should remove an addon from the addons map and addonClasses map', () => {
    addonManager.addAddon(TestAddon, 'TestAddon');
    addonManager.removeAddon('TestAddon');
    expect(addonManager.addons.has('TestAddon')).toBe(false);
    expect(addonManager.addonClasses.has('TestAddon')).toBe(false);
  });

  test('removeAddon should remove instance properties from the addon', () => {
    addonManager.addAddon(TestAddon, 'TestAddon');
    addonManager.removeAddon('TestAddon');
    const testAddonInstance = addonManager.addons.get('TestAddon');
    expect(testAddonInstance).toBe(undefined);
  });

  test('removeAddon should remove dependencies from the addon', () => {
    addonManager.addAddon(TestAddonWithDependency, 'TestAddonWithDependency');
    addonManager.removeAddon('TestAddonWithDependency');
    const testAddonInstance = addonManager.addons.get(
      'TestAddonWithDependency'
    );
    expect(testAddonInstance).toBe(undefined);
    const testDependencyInstance = addonManager.addons.get('TestDependency');
    expect(testDependencyInstance).toBe(undefined);
  });

  test('getAddon should return the addon class by name', () => {
    addonManager.addAddon(TestAddon, 'TestAddon');
    const TestAddonClass = addonManager.getAddon('TestAddon');
    expect(TestAddonClass).toBe(TestAddon);
  });
});
