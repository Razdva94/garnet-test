export interface IContact {
	id: string;
	name: string;
	phone: string;
	email: string;
	tags?: string;
	lastInteraction?: Date;
}
export type IContactResponsePost = Omit<IContact, 'tags'> & {
	tags?: string[];
};
export type IContactRequestPost = Omit<IContact, 'id' | 'tags'> & {
	tags?: string[];
};
export type IContactRequestUpdate = Partial<IContactRequestPost>;

export type IContactResponseGet = IContactResponsePost[];
