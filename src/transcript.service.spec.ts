import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

describe('addGrade', () => {
  it('should add a grade to the should add a courseGrade to the database', () => {
    const id1 = db.addStudent('blair');
    const courseGrade1 = { course: 'CS101', grade: 95 };
    db.addGrade(id1, 'CS101', courseGrade1);
    expect(db.getGrade(id1, 'CS101')).toEqual(95);
  });

  it('should throw an error when adding a grade for a non-existent student', () => {
    expect(() => db.addGrade(1, 'CS101', { course: 'CS101', grade: 85 })).toThrowError();
  });

  // Two ways in which the addGrade function isn’t completely specified by the conditions of satisfaction given in lecture are whether adding more than one CourseGrade per student per course updates grade or throws error and whether addGrade updates transcript

  it('should throw an error when adding a grade for a student for a course they already have a grade for', () => {
    const id1 = db.addStudent('blair');
    const courseGrade1 = { course: 'CS101', grade: 95 };
    const courseGrade2 = { course: 'CS101', grade: 85 };
    db.addGrade(id1, 'CS101', courseGrade1);
    expect(() => db.addGrade(id1, 'CS101', courseGrade2)).toThrowError();
  });

  it('should update the transcript when a grade is added', () => {
    const id1 = db.addStudent('blair');
    const courseGrade1 = { course: 'CS101', grade: 95 };
    db.addGrade(id1, 'CS101', courseGrade1);
    const transcript = db.getTranscript(id1);
    expect(transcript.grades).toContainEqual(courseGrade1);
  });
});
