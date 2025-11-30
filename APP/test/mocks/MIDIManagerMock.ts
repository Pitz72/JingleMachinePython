class MIDIManagerMock {
    private static instance: MIDIManagerMock;

    public static getInstance(): MIDIManagerMock {
        if (!MIDIManagerMock.instance) {
            MIDIManagerMock.instance = new MIDIManagerMock();
        }
        return MIDIManagerMock.instance;
    }

    public setLearnMode(active: boolean) { }
    public prepareToLearn(buttonId: number) { }
    public clearMapping() { }
    public getIsLearnMode() { return false; }
    public loadMapping() { }
    public saveMapping() { }
}

export default MIDIManagerMock;
