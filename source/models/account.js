// Instruments
import { donations } from '../odm';
import { NotFoundError } from '../utils';

export class Donations {
  constructor(data) {
    this.data = data;
  }

  async create() {
    const data = await lessons.create(this.data);

    return data;
  }

  async getAll() {}

  async getById() {
    const { id } = this.data;

    const data = await donations
      .findOne({ id })
      .select('-__v -id')
      .lean();

    if (!data) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    return data;
  }

  async updateByHash() {
    const { hash, payload } = this.data;

    const data = await lessons.findOneAndUpdate({ hash }, payload);

    if (!data) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    return data;
  }

  async removeByTransactionId() {
    const { transaction_id } = this.data;

    const data = await lessons.findOneAndDelete({ transaction_id });

    if (!data) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    return data;
  }

  async addDonation() {
    const { id, payload } = this.data;

    const data = await donations.findOneAndUpdate(
      { id },
      { $addToSet: { 'content.videos': payload } },
      { new: true }
    );

    if (!data) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    return data;
  }

  async addKeynote() {
    const { hash, payload } = this.data;

    const data = await lessons.findOneAndUpdate(
      { hash },
      { $addToSet: { 'content.keynotes': payload } },
      { new: true }
    );

    if (!data) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    return data;
  }

  async getVideo() {
    const { hash, videoHash } = this.data;

    const source = await lessons.findOne({
      hash,
    });

    if (!source) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    const {
      content: { videos },
    } = source;

    if (!videos.length) {
      throw new NotFoundError(
        `lesson with hash ${hash} does not contain videos`
      );
    }

    const [video] = videos.filter(({ hash }) => hash === videoHash);

    if (!video) {
      throw new NotFoundError(
        `lesson with hash ${hash} does not contain video with hash ${videoHash}`
      );
    }

    return video;
  }

  async removeVideo() {
    const { hash, videoHash } = this.data;

    const source = await lessons.findOneAndUpdate(
      {
        hash,
        'content.videos.hash': videoHash,
      },
      { $pull: { 'content.videos': { hash: videoHash } } }
    );

    if (!source) {
      throw new NotFoundError(
        `can not find lesson with hash ${hash} and video hash ${videoHash}`
      );
    }

    return null;
  }

  async getKeynote() {
    const { hash, keynoteHash } = this.data;

    const source = await lessons.findOne({
      hash,
    });

    if (!source) {
      throw new NotFoundError(`can not find document with hash ${hash}`);
    }

    const {
      content: { keynotes },
    } = source;

    if (!keynotes.length) {
      throw new NotFoundError(
        `lesson with hash ${hash} does not contain keynotes`
      );
    }

    const [keynote] = keynotes.filter(({ hash }) => hash === keynoteHash);

    if (!keynote) {
      throw new NotFoundError(
        `lesson with hash ${hash} does not contain keynote with hash ${keynoteHash}`
      );
    }

    return keynote;
  }

  async removeKeynote() {
    const { hash, keynoteHash } = this.data;

    const source = await lessons.findOneAndUpdate(
      {
        hash,
        'content.keynotes.hash': keynoteHash,
      },
      { $pull: { 'content.keynotes': { hash: keynoteHash } } }
    );

    if (!source) {
      throw new NotFoundError(
        `can not find lesson with hash ${hash} and keynote hash ${keynoteHash}`
      );
    }

    return null;
  }
}
